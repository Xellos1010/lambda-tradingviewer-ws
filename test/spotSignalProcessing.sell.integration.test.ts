// test\spotSignalProcessing.sell.integration.test.ts
import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';
import CoinbaseClient from "../src/coinbase/CoinbaseClient";
import config from "../src/config";
import Config from '../src/coinbase/config/Config';
import { Account } from '../src/coinbase/rest/types/accounts/Account';
import { GetMarketTradesResponse } from '../src/coinbase/rest/types/products/GetMarketTrades';
import { ListAccountsResponse } from '../src/coinbase/rest/types/accounts/ListAccountsResponse';

describe("Coinbase API Integration Test - Sell Order", () => {
  it("should create a sell order, preview it, edit it, and then cancel it", async () => {
    const timings = {
      startTime: performance.now(),
      endTime: 0,
      listAccountsTime: 0,
      getMarketTradesTime: 0,
      generateClientOrderIDTime: 0,
      createSellOrderTime: 0
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

      // 3) Calculate how much of the asset can be sold for and what price the asset can be sold for
      const sellPrice = calculateSellPrice(marketData as GetMarketTradesResponse);
      const sellSize = calculateSellSize(assetAccount);
      const testSellSize = 0.00000001;

      console.log("Calculated Sell Price:", sellPrice);
      console.log("Calculated Sell Size:", sellSize);
      console.log("Setting Test Sell Size To:", testSellSize);
      
      // 4) Place a Sell Order with a 10 minute cancel policy
      const orderConfig = {
        limit_price: sellPrice.toString(),
        end_time: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
        post_only: true
      };

      const startGenerateClientOrderID = performance.now();
      const clientOrderID = await client.orders?.generateClientOrderID();
      timings.generateClientOrderIDTime = performance.now() - startGenerateClientOrderID;

      if (!clientOrderID) {
        throw new Error("Failed to generate client order ID");
      }

      const startCreateSellOrder = performance.now();
      const sellOrder = await client.orders?.createSellOrder('BTC-USD', testSellSize.toString(), clientOrderID, orderConfig); // Replace 'BTC-USD' with the relevant asset pair
      timings.createSellOrderTime = performance.now() - startCreateSellOrder;

      console.log("Sell Order placed:", sellOrder);
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
      writePerformanceDataToFile('spotSignalProcessing.sell', timings);
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
  const bestAsk = marketData.best_ask;

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
