import {
  calculateBuySize,
  calculateSellSize,
} from "../helpers/sizeCalculations";
import {
  calculateBuyPrice,
  calculateSellPrice,
} from "../helpers/priceCalculations";
import { Account } from "../coinbase/rest/types/accounts/Account";
import { ListAccountsResponse } from "../coinbase/rest/types/accounts/ListAccountsResponse";
import { GetMarketTradesResponse } from "../coinbase/rest/types/products/GetMarketTrades";
import CoinbaseClient from "../coinbase/CoinbaseClient";

export const executePlaceBuyOrder = async (
  client: CoinbaseClient,
  asset: string,
  currency: string
): Promise<void> => {
  const product_id = `${asset}-${currency}`;

  try {
    // 1) List accounts and find the asset and currency account
    const accountsData = await client.accounts?.listAccounts();
    const accounts: Account[] = (accountsData as ListAccountsResponse).accounts;

    const assetAccount = accounts.find(
      (account: Account) => account.currency === asset
    );
    const currencyAccount = accounts.find(
      (account: Account) => account.currency === currency
    );

    if (!assetAccount || !currencyAccount) {
      throw new Error("Asset or currency account not found");
    }

    // 2) Calculate the current market price for asset and the order book for the asset
    const marketData = await client.products?.getMarketTrades(product_id);

    // 3) Set the fixed buy size
    const buySize = calculateBuySize(currencyAccount); //0.00000001;//

    // 4) Calculate the optimal buy price based on buy size and percentage
    const optimalBuyPrice = calculateBuyPrice(
      marketData as GetMarketTradesResponse,
      buySize,
      0.5 //This is statically typed and should be an exposed variable based on strategy
    );

    // 5) Place a Buy Order with a 10-minute cancel policy
    const orderConfig = {
      limit_price: optimalBuyPrice.toString(),
      end_time: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      post_only: true,
    };

    const clientOrderID = await client.orders?.generateClientOrderID();
    if (!clientOrderID) {
      throw new Error("Failed to generate client order ID");
    }

    await client.orders?.createBuyOrder(
      product_id,
      buySize.toString(),
      clientOrderID,
      orderConfig
    );
    // Log the successful submission of the buy order
    console.log(
      `Successfully submitted buy order. Order details: Product ID: ${product_id}, Size: ${buySize}, Client Order ID: ${clientOrderID}, Order Config: ${JSON.stringify(
        orderConfig
      )}`
    );
  } catch (error) {
    console.error("Error placing buy order:", error);
    throw error;
  }
};

export const executePlaceSellOrder = async (
  client: CoinbaseClient,
  asset: string,
  currency: string
): Promise<void> => {
  const product_id = `${asset}-${currency}`;

  try {
    // 1) List accounts and find the asset and currency account
    const accountsData = await client.accounts?.listAccounts();
    const accounts: Account[] = (accountsData as ListAccountsResponse).accounts;

    const assetAccount = accounts.find(
      (account: Account) => account.currency === asset
    );
    const currencyAccount = accounts.find(
      (account: Account) => account.currency === currency
    );

    if (!assetAccount || !currencyAccount) {
      throw new Error("Asset or currency account not found");
    }

    // 2) Calculate the current market price for asset and the order book for the asset
    const marketData = await client.products?.getMarketTrades(product_id);

    // 3) Calculate the sell size based on the asset account balance
    const sellSize = calculateSellSize(assetAccount); //0.00000001;//

    // 4) Calculate the optimal sell price based on sell size and percentage
    const optimalSellPrice = calculateSellPrice(
      marketData as GetMarketTradesResponse,
      sellSize,
      0.5 //This is statically typed and should be an exposed variable based on strategy
    );

    // 5) Place a Sell Order with a 10-minute cancel policy
    const orderConfig = {
      limit_price: optimalSellPrice.toString(),
      end_time: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      post_only: true,
    };

    const clientOrderID = await client.orders?.generateClientOrderID();
    if (!clientOrderID) {
      throw new Error("Failed to generate client order ID");
    }

    await client.orders?.createSellOrder(
      product_id,
      sellSize.toString(),
      clientOrderID,
      orderConfig
    );
    // Log the successful submission of the sell order
    console.log(
      `Successfully submitted sell order. Order details: Product ID: ${product_id}, Size: ${sellSize}, Client Order ID: ${clientOrderID}, Order Config: ${JSON.stringify(
        orderConfig
      )}`
    );
  } catch (error) {
    console.error("Error placing sell order:", error);
    throw error;
  }
};
