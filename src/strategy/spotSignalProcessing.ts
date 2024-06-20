import { STRATEGY_ACTION_SELL, STRATEGY_ACTION_BUY } from '../constants';
// import SpotStrategy from '../strategy/SpotStrategy';
// import { getCognitoUser } from '../cognito';
import CoinbaseClient from '../coinbase/CoinbaseClient';

export const signalSpotProcessing = async (client: CoinbaseClient, action: string, asset: string, currency: string, type: string): Promise<any> => {
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
      console.error('signalSpotProcessing error', e);
    }
  }

  //Work in progress for the dry run which will sell and buy BTC-USD for the client calculating the max possible. After the execution the order placement is put in the database. Without some cron or event bridge handler functionality the order can be placed but if it is not filled then there is no follow-up to cancel
  const executePlaceSellOrder = async(client: CoinbaseClient, asset: string, currency: string)=>{
    const product_id = `${asset}-${currency}`;
    // steps to execute 
    // 1) list accounts and find the asset and currency account
    // 2) calculate the current market price for asset and the order book for the asset (we want to choose a safe exit point which will be filled right away)
    // 3) calculate how much of the asset can be sold for and what price the asset can be sold for
    // 4) Place a Sell Order with a 10 minute cancel policy
  }

  const executePlaceBuyOrder = async(client: CoinbaseClient, asset: string, currency: string)=>{
    const product_id = `${asset}-${currency}`;
        // steps to execute 
    // 1) list accounts and find the asset and currency account
    // 2) calculate the current market price for asset and the order book for the asset (we want to choose a safe exit point which will be filled right away)
    // 3) calculate how much of the asset can be sold for and what price the asset can be sold for
    // 4) Place a Buy Order with a 10 minute cancel policy
  }