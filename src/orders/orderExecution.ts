import { calculateBuyPrice, calculateSellPrice } from '../helpers/priceCalculations';
// import { calculateBuySize, calculateSellSize } from '../helpers/sizeCalculations';
import { Account } from '../coinbase/rest/types/accounts/Account';
import { ListAccountsResponse } from '../coinbase/rest/types/accounts/ListAccountsResponse';
import { GetMarketTradesResponse } from '../coinbase/rest/types/products/GetMarketTrades';
import CoinbaseClient from '../coinbase/CoinbaseClient';

export const executePlaceSellOrder = async (client: CoinbaseClient, asset: string, currency: string): Promise<void> => {
  const product_id = `${asset}-${currency}`;

  try {
    // 1) List accounts and find the asset and currency account
    const accountsData = await client.accounts?.listAccounts();
    const accounts: Account[] = (accountsData as ListAccountsResponse).accounts;

    const assetAccount = accounts.find((account: Account) => account.currency === asset);
    const currencyAccount = accounts.find((account: Account) => account.currency === currency);

    if (!assetAccount || !currencyAccount) {
      throw new Error("Asset or currency account not found");
    }

    // 2) Calculate the current market price for asset and the order book for the asset
    const marketData = await client.products?.getMarketTrades(product_id);
    const sellPrice = calculateSellPrice(marketData as GetMarketTradesResponse);

    // 3) Calculate how much of the asset can be sold and at what price
    const sellSize = 0.00000001;//calculateSellSize(assetAccount);

    // 4) Place a Sell Order with a 10-minute cancel policy
    const orderConfig = {
      limit_price: sellPrice.toString(),
      end_time: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      post_only: true
    };

    const clientOrderID = await client.orders?.generateClientOrderID();
    if (!clientOrderID) {
      throw new Error("Failed to generate client order ID");
    }

    await client.orders?.createSellOrder(product_id, sellSize.toString(), clientOrderID, orderConfig);

  } catch (error) {
    console.error("Error placing sell order:", error);
    throw error;
  }
};

export const executePlaceBuyOrder = async (client: CoinbaseClient, asset: string, currency: string): Promise<void> => {
  const product_id = `${asset}-${currency}`;

  try {
    // 1) List accounts and find the asset and currency account
    const accountsData = await client.accounts?.listAccounts();
    const accounts: Account[] = (accountsData as ListAccountsResponse).accounts;

    const assetAccount = accounts.find((account: Account) => account.currency === asset);
    const currencyAccount = accounts.find((account: Account) => account.currency === currency);

    if (!assetAccount || !currencyAccount) {
      throw new Error("Asset or currency account not found");
    }

    // 2) Calculate the current market price for asset and the order book for the asset
    const marketData = await client.products?.getMarketTrades(product_id);
    const buyPrice = calculateBuyPrice(marketData as GetMarketTradesResponse);

    // 3) Calculate how much of the asset can be bought and at what price
    const buySize = 0.00000001;//calculateBuySize(currencyAccount);

    // 4) Place a Buy Order with a 10-minute cancel policy
    const orderConfig = {
      limit_price: buyPrice.toString(),
      end_time: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      post_only: true
    };

    const clientOrderID = await client.orders?.generateClientOrderID();
    if (!clientOrderID) {
      throw new Error("Failed to generate client order ID");
    }

    await client.orders?.createBuyOrder(product_id, buySize.toString(), clientOrderID, orderConfig);

  } catch (error) {
    console.error("Error placing buy order:", error);
    throw error;
  }
};
