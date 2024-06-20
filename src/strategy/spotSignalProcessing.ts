import CoinbaseClient from "../coinbase/CoinbaseClient";
import { STRATEGY_ACTION_SELL, STRATEGY_ACTION_BUY } from "../constants";

import {
  executePlaceSellOrder,
  executePlaceBuyOrder,
} from "../orders/orderExecution";

export const signalSpotProcessing = async (
  client: CoinbaseClient,
  action: string,
  asset: string,
  currency: string,
  // type: string
): Promise<any> => {
  try {
    //   const strategy = new SpotStrategy(client, symbol, type);
    //   await strategy.init();

    if (action === STRATEGY_ACTION_SELL) {
      await executePlaceSellOrder(client, asset, currency);
    } else if (action === STRATEGY_ACTION_BUY) {
      // await strategy.buy(currency);
      await executePlaceBuyOrder(client, asset, currency);
    }
    //   TODO: implement Cognito
    //   else if (action === BOT_STAT) {
    //     await getCognitoUser(accessToken);
    //     return strategy.stat();
    //   }
  } catch (e) {
    console.error("signalSpotProcessing error", e);
  }
};
