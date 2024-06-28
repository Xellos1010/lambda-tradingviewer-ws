// test\spotSignalProcessing.buy.integration.test.ts
import { performance } from 'perf_hooks';
import { getAllKeyFilePaths } from "../../src/config";
import { CoinbaseClient, KeyFileConfig, loadKeyfile } from 'coinbase-advanced-node-ts';
import { GetMarketTradesParams, GetMarketTradesResponse } from 'coinbase-advanced-node-ts/dist/rest/types/products';
import { Account } from 'coinbase-advanced-node-ts/dist/rest/types/accounts/Account';
import { ListAccountsResponse } from 'coinbase-advanced-node-ts/dist/rest/types/accounts';
import { calculateBuyPrice } from '../../src/helpers/priceCalculations';
import { calculateBuySize } from '../../src/helpers/sizeCalculations';
import { writePerformanceDataToFile } from '../utils/writePerformanceDataToFile';

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
      const firstKeyFile = getAllKeyFilePaths()[0];
      const config = loadKeyfile(firstKeyFile);
      const client = new CoinbaseClient(
        KeyFileConfig.getInstance(config.name, config.privateKey)
      );

      // 1) List accounts and find the asset and currency account
      const startListAccounts = performance.now();
      const accountsData = await client.accounts?.listAccounts();
      timings.listAccountsTime = performance.now() - startListAccounts;

      const params: GetMarketTradesParams = { limit: 100 };

      // 2) Calculate the current market price for asset and the order book for the asset
      const startGetMarketTrades = performance.now();
      const marketData = await client.products?.getMarketTrades('BTC-USD', params); // Replace 'BTC-USD' with the relevant asset pair
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

      let buySize;
      try {
        buySize = calculateBuySize(assetAccount, 0.01); // 1% of the available balance
      } catch (error) {
        console.error("Error calculating sell size:", error);
        buySize = 0.0000001; // Gracefully default to the minimum sell size
      }
      
      const buyPrice = calculateBuyPrice(marketData as GetMarketTradesResponse, buySize, 0.10);
      let amountToBuy = parseFloat((buySize / buyPrice).toFixed(7)); // Limit to 7 decimal places
      if (amountToBuy < 0.0000001) {
        amountToBuy = 0.0000001; // Default to minimum sell size
      }

      console.log("Calculated Buy Price:", buyPrice);
      console.log("Calculated Buy Size:", buySize);
      console.log("Amount to Buy:", amountToBuy);

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
      const buyOrder = await client.orders?.createBuyOrder('BTC-USD', amountToBuy.toString(), clientOrderID, orderConfig); // Replace 'BTC-USD' with the relevant asset pair
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
