import {
  calculateBuySize,
  calculateSellSize,
} from "../helpers/sizeCalculations";
import {
  calculateBuyPrice,
  calculateSellPrice,
} from "../helpers/priceCalculations";
import { CoinbaseClient } from "coinbase-advanced-node-ts";
import { Account } from "coinbase-advanced-node-ts/dist/rest/types/accounts/Account";
import { ListAccountsResponse } from "coinbase-advanced-node-ts/dist/rest/types/accounts/ListAccountsResponse";
import { GetMarketTradesResponse, GetMarketTradesParams} from "coinbase-advanced-node-ts/dist/rest/types/products";

export const executePlaceBuyOrder = async (
  client: CoinbaseClient,
  asset: string,
  currency: string
): Promise<void> => {
  const product_id = `${asset}-${currency}`;

  try {
    // 1) List accounts and find the asset and currency account
    const accountsData = await client.accounts?.listAccounts();

    const params: GetMarketTradesParams = { limit: 100 };

    // 2) Calculate the current market price for asset and the order book for the asset
    const marketData = await client.products?.getMarketTrades('BTC-USD', params); // Replace 'BTC-USD' with the relevant asset pair

    console.log("Accounts Data:", accountsData);
    console.log("Market Data:", marketData);

    // Extract accounts array from the response
    const accounts: Account[] = (accountsData as ListAccountsResponse).accounts;

    // Find the asset and currency account from the list of accounts
    const assetAccount = accounts.find((account: Account) => account.currency === 'BTC'); // Replace 'BTC' with the relevant asset
    const currencyAccount = accounts.find((account: Account) => account.currency === 'USD'); // Replace 'USD' with the relevant currency

    if (!assetAccount) {
      console.error("Asset account not found. Accounts data:", accounts);
      throw new Error("Asset account not found");
    }

    if (!currencyAccount) {
      console.error("Currency account not found. Accounts data:", accounts);
      throw new Error("Currency account not found");
    }

    console.log("Asset Account:", assetAccount);
    console.log("Currency Account:", currencyAccount);

    let buySize;
    try {
      buySize = calculateBuySize(assetAccount, 0.20); // 20% of the available balance
    } catch (error) {
      console.error("Error calculating sell size:", error);
      buySize = 0.0000001; // Gracefully default to the minimum sell size
    }
    
    const buyPrice = calculateBuyPrice(marketData as GetMarketTradesResponse, buySize, 0.30);
    let amountToBuy = parseFloat((buySize / buyPrice).toFixed(7)); // Limit to 7 decimal places
    if (amountToBuy < 0.0000001) {
      amountToBuy = 0.0000001; // Default to minimum sell size
    }

    console.log("Calculated Buy Price:", buyPrice);
    console.log("Calculated Buy Size:", buySize);
    console.log("Amount to Buy:", amountToBuy);


    // 5) Place a Buy Order with a 10-minute cancel policy
    const orderConfig = {
      limit_price: buyPrice.toString(),
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

    const params: GetMarketTradesParams = { limit: 100 };

    // 2) Calculate the current market price for asset and the order book for the asset
    const marketData = await client.products?.getMarketTrades('BTC-USD', params); // Replace 'BTC-USD' with the relevant asset pair

    console.log("Accounts Data:", accountsData);
    console.log("Market Data:", marketData);

    // Extract accounts array from the response
    const accounts: Account[] = (accountsData as ListAccountsResponse).accounts;

    // Find the asset and currency account from the list of accounts
    const assetAccount = accounts.find((account: Account) => account.currency === 'BTC'); // Replace 'BTC' with the relevant asset
    const currencyAccount = accounts.find((account: Account) => account.currency === 'USD'); // Replace 'USD' with the relevant currency

    if (!assetAccount) {
      console.error("Asset account not found. Accounts data:", accounts);
      throw new Error("Asset account not found");
    }

    if (!currencyAccount) {
      console.error("Currency account not found. Accounts data:", accounts);
      throw new Error("Currency account not found");
    }

    console.log("Asset Account:", assetAccount);
    console.log("Currency Account:", currencyAccount);

    // 3) Calculate how much of the asset can be sold and at what price
    
    let sellSize;
    try {
      sellSize = calculateSellSize(assetAccount, 1); // 100% of the available balance
    } catch (error) {
      console.error("Error calculating sell size:", error);
      sellSize = 0.0000001; // Gracefully default to the minimum sell size
    }
    
    const sellPrice = calculateSellPrice(marketData as GetMarketTradesResponse, sellSize, 0.50);
    console.log("Calculated Sell Price:", sellPrice);
    console.log("Calculated Sell Size:", sellSize);
    console.log("Amount to Sell:", sellSize);

    // 5) Place a Sell Order with a 10-minute cancel policy
    const orderConfig = {
      limit_price: sellPrice.toString(),
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
