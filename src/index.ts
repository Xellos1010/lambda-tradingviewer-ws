// src\index.ts
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent
} from "aws-lambda";
// import {STRATEGY_ACTION_SELL, STRATEGY_ACTION_BUY, STRATEGY_STATUS, BOT_STAT} from './constants'
import {STRATEGY_ACTION_SELL, STRATEGY_ACTION_BUY, BOT_STAT} from './constants'
import config from './config'
// import strategyProvider from './db/provider/strategy'
import SpotStrategy from './strategy/SpotStrategy'
import cognito from "./helper/cognito";

type TAction = typeof STRATEGY_ACTION_SELL | typeof STRATEGY_ACTION_BUY

const getAction = (action: any): TAction => {
    // let data = req.body
    // try {
    //     data = JSON.parse(data)
    // } catch (e) {
    // }
    // let action = ''

    // if (data) {
    //     if (typeof data === 'string') {
    //         action = data
    //     } else if (data && data.message) {
    //         action = data.message
    //     } else if (data && data.action) {
    //         action = data.action
    //     } else {
    //         action = data.order && data.order.action
    //     }
    // }

    return action as TAction
}

const signalSpotProcessing = async (action: string, symbol: string, currency: string, type: string, accessToken: string): Promise<any> => {
    try {
        const strategy = new SpotStrategy(symbol, type)
        await strategy.init()

        if (action === STRATEGY_ACTION_SELL) {
            // const lastStrategy: TStrategy | undefined = await strategyProvider.getCurrentStrategy(type, symbol)
            // if (lastStrategy) {
            //     strategy.setStrategy(lastStrategy)
            // }
            // if (strategy.strategy.status !== STRATEGY_STATUS.STARTED) {
            //     return
            // }
            await strategy.sell()

        } else if (action === STRATEGY_ACTION_BUY) {
            try {
                // const lastStrategy: TStrategy | undefined = await strategyProvider.getCurrentStrategy(type, symbol)
                // if (lastStrategy?.id) {
                //     console.log('strategy in progress. do nothing')
                //     return
                // }
                await strategy.buy(currency)
            } catch (e) {
                console.log('error buy', e)
            }
        } else if (action === BOT_STAT) {
            await getCognitoUser(accessToken)
            return strategy.stat()
        }
    } catch (e) {
        console.error('signalSpotProcessing error', e)
    }
}

const getAccessToken = (req: any): string => {
    return req.headers?.authorization || "";
}

const getCognitoUser = async (accessToken: string) => {
    if (accessToken) {
        const cognitoUser = await cognito.getUserByAccessToken(accessToken);
        if (cognitoUser && cognitoUser.email && cognitoUser.email === config.user.email) {
            return cognitoUser
        }

    }
    throw new Error('Unauthorized')
}

export const errorResponse = (statusCode: number, message: string) => {
  return {
    statusCode,
    body: JSON.stringify({
      status: "error",
      message,
    }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
};

export const successResponse = () => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        message: "Signal Processed",
      }),
      headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
    };
  };

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
  

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _: any
) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  if (event.body === null) {
    console.log("Body is null");
    return errorResponse(400, "Missing body");
  }

  const bodyStr = event.body;
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
  const accessToken = getAccessToken(event)
  const asset = config.strategy.asset
  const currency = config.strategy.currency
  const symbol = `${asset}-${currency}`
  const type = config.strategy.type
  try {
      body = await signalSpotProcessing(action, symbol, currency, type, accessToken)
  } catch (e) {
      console.log('error', e)
  }

  return successResponse();
};
