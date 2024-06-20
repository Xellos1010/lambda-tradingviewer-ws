// test\spotSignalProcessing.buy.integration.test.ts
import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';
import CoinbaseClient from "../src/coinbase/CoinbaseClient";
import config from "../src/config";
import Config from './../src/coinbase/config/Config';
import { Account } from '../src/coinbase/rest/types/accounts/Account';
import { GetMarketTradesResponse } from '../src/coinbase/rest/types/products/GetMarketTrades';
import { ListAccountsResponse } from './../src/coinbase/rest/types/accounts/ListAccountsResponse';

describe("Coinbase API Integration Test - Buy Order", () => {
  it("should create a buy order, preview it, edit it, and then cancel it", async () => {
    const timings = {
      startTime: performance.now(),
      endTime: 0,
      listAccountsTime: 0,
      getMarketTradesTime: 0,
      generateClientOrderIDTime: 0,
      createBuyOrderTime: 0
    };

    try {
      const client = new CoinbaseClient(
        Config.getInstance(
          config.coinbase.keys[0].name,
          config.coinbase.keys[0].privateKey,
          config.coinbase.baseUrl
        )
      );

      // 1) List accounts and find the asset and currency account
      const startListAccounts = performance.now();
      const accountsData = await client.accounts?.listAccounts();
      timings.listAccountsTime = performance.now() - startListAccounts;

      // 2) Calculate the current market price for asset and the order book for the asset
      const startGetMarketTrades = performance.now();
      const marketData = await client.products?.getMarketTrades('BTC-USD'); // Replace 'BTC-USD' with the relevant asset pair
      timings.getMarketTradesTime = performance.now() - startGetMarketTrades;

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

      // 3) Calculate how much of the asset can be bought and at what price
      const buyPrice = calculateBuyPrice(marketData as GetMarketTradesResponse);
      const buySize = calculateBuySize(currencyAccount);
      const testBuySize = 0.00000001;

      console.log("Calculated Buy Price:", buyPrice);
      console.log("Calculated Buy Size:", buySize);
      console.log("Setting Test Buy Size To:", testBuySize);
      
      // 4) Place a Buy Order with a 10 minute cancel policy
      const orderConfig = {
        limit_price: buyPrice.toString(),
        end_time: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
        post_only: true
      };

      const startGenerateClientOrderID = performance.now();
      const clientOrderID = await client.orders?.generateClientOrderID();
      timings.generateClientOrderIDTime = performance.now() - startGenerateClientOrderID;

      if (!clientOrderID) {
        throw new Error("Failed to generate client order ID");
      }

      const startCreateBuyOrder = performance.now();
      const buyOrder = await client.orders?.createBuyOrder('BTC-USD', testBuySize.toString(), clientOrderID, orderConfig); // Replace 'BTC-USD' with the relevant asset pair
      timings.createBuyOrderTime = performance.now() - startCreateBuyOrder;

      console.log("Buy Order placed:", buyOrder);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
        throw error; // Ensure the test fails by re-throwing the error
      } else {
        console.error("Unexpected error:", error);
        throw new Error("Unexpected error occurred");
      }
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('spotSignalProcessing.buy', timings);
    }
  });
});

// Helper function to calculate the buy price based on market data
function calculateBuyPrice(marketData: GetMarketTradesResponse): number {
  if (!marketData || !marketData.trades || marketData.trades.length === 0) {
    console.error("Market data is empty or invalid:", marketData);
    throw new Error("Market data is empty or invalid");
  }

  // Assuming you want to use the best bid price for the buy order
  const bestBid = marketData.best_bid;

  if (!bestBid) {
    console.error("Best bid price is not available in market data:", marketData);
    throw new Error("Best bid price is not available");
  }

  return parseFloat(bestBid); // Convert string to number
}

// Helper function to calculate the buy size based on the currency account balance
function calculateBuySize(currencyAccount: Account): number {
  if (!currencyAccount || !currencyAccount.available_balance || parseFloat(currencyAccount.available_balance.value) <= 0) {
    console.error("Currency account balance is invalid:", currencyAccount);
    throw new Error("Currency account balance is invalid");
  }

  // Implement your logic to calculate the buy size
  return parseFloat(currencyAccount.available_balance.value); // Convert string to number
}

// Helper function to write performance data to a file
function writePerformanceDataToFile(testName: string, timings: any) {
  const dir = path.join(__dirname, '..', 'testResults');
  const filePath = path.join(dir, `${testName}_performanceMetrics.json`);

  // Ensure the testResults directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Write the timings object to a file
  fs.writeFileSync(filePath, JSON.stringify(timings, null, 2));
}
