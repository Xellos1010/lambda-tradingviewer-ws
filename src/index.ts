// src/index.ts
import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import config from './config';
import Config from './coinbase/config/Config';
import { errorResponse, successResponse } from "./utils/responses";
import { parseBody } from "./utils/bodyParser";
import CoinbaseClient from './coinbase/CoinbaseClient';
import { getAction } from "./utils/getAction";
import { signalSpotProcessing } from "./strategy/spotSignalProcessing";

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

  const orderAction = body.order_action.toUpperCase().trim(); //Has to be BUY or SELL
  console.log("Order Action:", orderAction);

  //We don't need contracts atm because we are investing the whole wallet between BTC-USD for the dry run.
  // const contracts = body.contracts;
  // console.log("Contracts:", contracts);


  // We don't need ticker information at the moment for the dry run we static define in the strategy the BTC as the asset and USD as the currency
  // const product_id = convertTickerToProductID(body.ticker); //Lets us know which Product is being watched by trading viewer. There is a caveat - Trading viewer symbols are BTCUSD whereby Coinbase ProductIDs are BTC-USD. Since we need a convertion.
  // console.log("product_id:", product_id);

  //We don't need position size atm because we are investing the whole wallet between BTC-USD for the dry run.

  // const positionSize = body.position_size;
  // console.log("Position Size:", positionSize);

  const action = getAction(orderAction);
  const asset = config.strategy.asset;
  const currency = config.strategy.currency;

  // We only have 1 strategy right now for the dry run.
  const type = config.strategy.type;

  // Create a client for each key and execute the strategy for each client
  const promises = config.coinbase.keys.map(async (keyData) => {
    
    const client = new CoinbaseClient(Config.getInstance(keyData.name, keyData.privateKey, config.coinbase.baseUrl));
    return await signalSpotProcessing(client, action, asset, currency, type);
  });

  try {
    await Promise.all(promises);
  } catch (e) {
    console.log('error', e);
  }

  return successResponse();
};
