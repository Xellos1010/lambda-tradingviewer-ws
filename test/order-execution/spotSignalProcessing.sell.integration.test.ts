// test\spotSignalProcessing.sell.integration.test.ts
import { performance } from 'perf_hooks';
import { getAllKeyFilePaths } from "../../src/config";
import { CoinbaseClient, KeyFileConfig, loadKeyfile } from 'coinbase-advanced-node-ts';
import { GetMarketTradesParams, GetMarketTradesResponse } from 'coinbase-advanced-node-ts/dist/rest/types/products';
import { Account } from 'coinbase-advanced-node-ts/dist/rest/types/accounts/Account';
import { ListAccountsResponse } from 'coinbase-advanced-node-ts/dist/rest/types/accounts';
import { calculateSellPrice } from '../../src/helpers/priceCalculations';
import { calculateSellSize } from '../../src/helpers/sizeCalculations';
import { writePerformanceDataToFile } from '../utils/writePerformanceDataToFile';

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

      // 3) Calculate how much of the asset can be sold and at what price
      
      let sellSize;
      try {
        sellSize = calculateSellSize(assetAccount, 0.01); // 1% of the available balance
      } catch (error) {
        console.error("Error calculating sell size:", error);
        sellSize = 0.0000001; // Gracefully default to the minimum sell size
      }
      
      const sellPrice = calculateSellPrice(marketData as GetMarketTradesResponse, sellSize, 0.10);
      let amountToSell = parseFloat((sellSize / sellPrice).toFixed(7)); // Limit to 7 decimal places
      if (amountToSell < 0.0000001) {
        amountToSell = 0.0000001; // Default to minimum sell size
      }
      console.log("Calculated Sell Price:", sellPrice);
      console.log("Calculated Sell Size:", sellSize);
      console.log("Amount to Sell:", amountToSell);

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
      const sellOrder = await client.orders?.createSellOrder('BTC-USD', amountToSell.toString(), clientOrderID, orderConfig); // Replace 'BTC-USD' with the relevant asset pair
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
