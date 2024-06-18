/// <reference path="./types/global.d.ts" />
import {STRATEGY_ACTION_SELL, STRATEGY_ACTION_BUY, STRATEGY_STATUS} from './constants'
import config from './config'
import strategyProvider from './db/provider/strategy'
import SpotStrategy from './strategy/SpotStrategy'

type TAction = typeof STRATEGY_ACTION_SELL | typeof STRATEGY_ACTION_BUY

const getAction = (action: any): TAction => {
    return action as TAction
}

const signalSpotProcessing = async (action: string, symbol: string, currency: string, type: string): Promise<any> => {
    try {
        const strategy = new SpotStrategy(symbol, type)
        await strategy.init()

        if (action === STRATEGY_ACTION_SELL) {
            const lastStrategy: TStrategy | undefined = await strategyProvider.getCurrentStrategy(type, symbol)
            if (lastStrategy) {
                strategy.setStrategy(lastStrategy)
            }
            if (strategy.strategy.status !== STRATEGY_STATUS.STARTED) {
                return
            }
            await strategy.sell()

        } else if (action === STRATEGY_ACTION_BUY) {
            try {
                const lastStrategy: TStrategy | undefined = await strategyProvider.getCurrentStrategy(type, symbol)
                if (lastStrategy?.id) {
                    console.log('strategy in progress. do nothing')
                    return
                }
                await strategy.buy(currency)
            } catch (e) {
                console.log('error buy', e)
            }
        }
    } catch (e) {
        console.error('signalSpotProcessing error', e)
    }
}


interface Body {
    strategy_name: string;
    strategy_params: string;
    order_action: string;
    contracts: string;
    ticker: string;
    position_size: string;
  }
  
  const parseBody = (str: string): Body => {
    const result: any = {};
    let key = '';
    let value = '';
    let insideParentheses = false;
  
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === '(') insideParentheses = true;
      if (char === ')') insideParentheses = false;
  
      if (char === ',' && !insideParentheses) {
        result[key.trim()] = value.trim();
        key = '';
        value = '';
      } else if (char === ':' && key === '') {
        key = value;
        value = '';
      } else {
        value += char;
      }
    }
  
    if (key !== '') {
      result[key.trim()] = value.trim();
    }
  
    return {
      strategy_name: result.strategy_name,
      strategy_params: result.strategy_params,
      order_action: result.order_action,
      contracts: result.contracts,
      ticker: result.ticker,
      position_size: result.position_size,
      // Add other expected properties here
    };
  };
  

export const handler : any = async (event : string) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  if (event === null) {
    console.log("Body is null");
    return '400, "Missing body"';
  }

  const bodyStr = event;
  let body = parseBody(bodyStr);

  console.log("Parsed body:", body);

  // Accessing and printing properties from the parsed body
  const strategyName = body.strategy_name;
  console.log("Strategy Name:", strategyName);

  const strategyParams = body.strategy_params; // This should be an array
  console.log("Strategy Params:", strategyParams);

  const orderAction = body.order_action;
  console.log("Order Action:", orderAction);

  const contracts = body.contracts;
  console.log("Contracts:", contracts);

  const ticker = body.ticker;
  console.log("Ticker:", ticker);

  const positionSize = body.position_size;
  console.log("Position Size:", positionSize);

  const action = getAction(orderAction)
  const asset = config.strategy.asset
  const currency = config.strategy.currency
  const symbol = `${asset}-${currency}`
  const type = config.strategy.type
  try {
      body = await signalSpotProcessing(action, symbol, currency, type)
  } catch (e) {
      console.log('error', e)
  }

  return 'Success';
};

// const inputStr = "strategy_name:V2-RSI-BB-Pyramid-v5,strategy_params:(84, 12, close, 12, 200, hlc3, 3, 2, 3, 1, 8, 2023, 6, 9, 2023),order_action:buy,contracts:.005,ticker:ticker,position_size:0";
const inputStr = "strategy_name:V2-RSI-BB-Pyramid-v5,strategy_params:(84, 12, close, 12, 200, hlc3, 3, 2, 3, 1, 8, 2023, 6, 9, 2023),order_action:buy,contracts:.005,ticker:ticker,position_size:0";
handler(inputStr)
  .then((result : string) => {
    console.log("Handler result:", result);
  })
  .catch((error : string) => {
    console.error("Handler error:", error);
  });