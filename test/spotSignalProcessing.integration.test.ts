import CoinbaseClient from "../src/coinbase/coinbaseClient";
import config from "../src/config";
import Config from './../src/coinbase/config/Config';
import { Account, ListAccountsResponse } from '../src/coinbase/rest/types/accounts/Account';
import { GetMarketTradesResponse } from '../src/coinbase/rest/types/products/GetMarketTrades';

describe("Coinbase API Integration Test - Buy Sell", () => {
  it("should create a buy order, preview it, edit it, and then cancel it", async () => {
    try {
      const client = new CoinbaseClient(
        Config.getInstance(
          config.coinbase.keys[0].name,
          config.coinbase.keys[0].privateKey,
          config.coinbase.baseUrl
        )
      );

      // 1) List accounts and find the asset and currency account
      // 2) Calculate the current market price for asset and the order book for the asset
      const [accountsData, marketData] = await Promise.all([
        client.listAccounts(),
        client.getMarketTrades('BTC-USD') // Replace 'BTC-USD' with the relevant asset pair
      ]);

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

      // 3) Calculate how much of the asset can be sold for and what price the asset can be sold for
      const sellPrice = calculateSellPrice(marketData as GetMarketTradesResponse);
      const sellSize = calculateSellSize(assetAccount);

      console.log("Calculated Sell Price:", sellPrice);
      console.log("Calculated Sell Size:", sellSize);

      // 4) Place a Sell Order with a 10 minute cancel policy
      // const orderConfig = {
      //   limit_price: sellPrice.toString(),
      //   end_time: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
      //   post_only: true
      // };

      // const clientOrderID = await client.generateClientOrderID();
      // const sellOrder = await client.createSellOrder('BTC-USD', sellSize.toString(), clientOrderID, orderConfig); // Replace 'BTC-USD' with the relevant asset pair

      // console.log("Sell Order placed:", sellOrder);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  });
});

// Helper function to calculate the sell price based on market data
function calculateSellPrice(marketData: GetMarketTradesResponse): number {
  if (!marketData || !marketData.trades || marketData.trades.length === 0) {
    console.error("Market data is empty or invalid:", marketData);
    throw new Error("Market data is empty or invalid");
  }

  // Assuming you want to use the best ask price for the sell order
  const bestAsk = marketData.trades[0].best_ask;

  if (!bestAsk) {
    console.error("Best ask price is not available in market data:", marketData);
    throw new Error("Best ask price is not available");
  }

  return parseFloat(bestAsk); // Convert string to number
}

// Helper function to calculate the sell size based on the asset account balance
function calculateSellSize(assetAccount: Account): number {
  if (!assetAccount || !assetAccount.available_balance || parseFloat(assetAccount.available_balance.value) <= 0) {
    console.error("Asset account balance is invalid:", assetAccount);
    throw new Error("Asset account balance is invalid");
  }

  // Implement your logic to calculate the sell size
  return parseFloat(assetAccount.available_balance.value); // Convert string to number
}
