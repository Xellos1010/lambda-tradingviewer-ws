// src\aws-lambda\handler.ts
import {
    APIGatewayProxyHandler,
    APIGatewayProxyEvent
  } from "aws-lambda";
  import { STRATEGY_ACTION_SELL, STRATEGY_ACTION_BUY, BOT_STAT } from '../constants';
  import config from '../config';
  import SpotStrategy from '../strategy/SpotStrategy';
  import cognito from "../cognito/cognito";
  import { errorResponse, successResponse } from "../utils/responses";
  import { parseBody } from "../utils/bodyParser";
  import CoinbaseClient from '../coinbase/CoinbaseClient';
  import { Body } from '../data/model/recieving_data';
  
  type TAction = typeof STRATEGY_ACTION_SELL | typeof STRATEGY_ACTION_BUY;
  
  const getAction = (data: any): TAction => {
    let action = '';
  
    if (data) {
      if (typeof data === 'string') {
        action = data;
      } else if (data.message) {
        action = data.message;
      } else if (data.action) {
        action = data.action;
      } else {
        action = data.order && data.order.action;
      }
    }
  
    return action as TAction;
  }
  
  const signalSpotProcessing = async (action: string, symbol: string, currency: string, type: string, accessToken: string): Promise<any> => {
    try {
      const strategy = new SpotStrategy(symbol, type);
      await strategy.init();
  
      if (action === STRATEGY_ACTION_SELL) {
        await strategy.sell();
      } else if (action === STRATEGY_ACTION_BUY) {
        await strategy.buy(currency);
      } else if (action === BOT_STAT) {
        await getCognitoUser(accessToken);
        return strategy.stat();
      }
    } catch (e) {
      console.error('signalSpotProcessing error', e);
    }
  }
  
  const getAccessToken = (req: any): string => {
    return req.headers?.authorization || "";
  }
  
  const getCognitoUser = async (accessToken: string) => {
    if (accessToken) {
      const cognitoUser = await cognito.getUserByAccessToken(accessToken);
      if (cognitoUser && cognitoUser.email && cognitoUser.email === config.user.email) {
        return cognitoUser;
      }
    }
    throw new Error('Unauthorized');
  }
  
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
  
    const action = getAction(orderAction);
    const accessToken = getAccessToken(event);
    const asset = config.strategy.asset;
    const currency = config.strategy.currency;
    const symbol = `${asset}-${currency}`;
    const type = config.strategy.type;
  
    try {
      body = await signalSpotProcessing(action, symbol, currency, type, accessToken);
    } catch (e) {
      console.log('error', e);
    }
  
    return successResponse();
  };
  