import CoinbaseClient from "../../../src/coinbase/CoinbaseClient";
import Config from "../../../src/coinbase/config/Config";
import config from "../../../src/config";

describe("Coinbase API Integration Test - Market Trades", () => {
  it("should fetch market trades for a product", async () => {
    try {
      const client = new CoinbaseClient(
        Config.getInstance(
          config.coinbase.keys[0].name,
          config.coinbase.keys[0].privateKey,
          config.coinbase.baseUrl
        )
      );

      // Fetch market trades for a product
      const marketData = await client.products?.getMarketTrades('BTC-USD'); // Replace 'BTC-USD' with the relevant asset pair

      console.log("Market Data:", marketData);

      // Assert that market data is not empty
      if (!marketData || !marketData.trades || marketData.trades.length === 0) {
        throw new Error("Market data is empty or invalid");
      }

      // Assuming you want to use the best ask price for further processing
      const bestAsk = marketData.best_ask;

      if (!bestAsk) {
        throw new Error("Best ask price is not available in market data");
      }

      console.log("Best Ask Price:", bestAsk);

    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
        throw error; // Ensure the test fails by re-throwing the error
      } else {
        console.error("Unexpected error:", error);
        throw new Error("Unexpected error occurred");
      }
    }
  });
});
