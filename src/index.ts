import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import config from './config';
import Config from './coinbase/config/Config';
import { errorResponse, successResponse } from "./utils/responses";
import { parseBody } from "./utils/bodyParser";
import { getAction } from "./utils/getAction";
import { signalSpotProcessing } from "./strategy/spotSignalProcessing";
import CoinbaseClient from './coinbase/CoinbaseClient';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _: any
) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  if (!event.body) {
    console.log("Body is null");
    return errorResponse(400, "Missing body");
  }

  try {
    const body = parseBody(event.body);
    console.log("Parsed body:", body);

    const strategyName = body.strategy_name;
    console.log("Strategy Name:", strategyName);

    const strategyParams = body.strategy_params; // This should be an array
    console.log("Strategy Params:", strategyParams);

    const orderAction = body.order_action.toUpperCase().trim(); //Has to be BUY or SELL
    console.log("Order Action:", orderAction);

    const action = getAction(orderAction);
    const asset = config.strategy.asset;
    const currency = config.strategy.currency;

    const promises = config.coinbase.keys.map(async (keyData) => {
      const client = new CoinbaseClient(Config.getInstance(keyData.name, keyData.privateKey, config.coinbase.baseUrl));
      return await signalSpotProcessing(client, action, asset, currency);
    });

    await Promise.all(promises);
    return successResponse();
  } catch (error) {
    console.error('Error processing event:', error);
    return errorResponse(500, 'Internal Server Error');
  }
};
