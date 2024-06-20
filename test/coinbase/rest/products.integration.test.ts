import CoinbaseClient from "../../../src/coinbase/CoinbaseClient";
import config from "../../../src/config";
import Config from "../../../src/coinbase/config/Config";

describe("Coinbase API Integration Test - Products", () => {
  it("should fetch products and then fetch a product by ID", async () => {
    try {
      const client = new CoinbaseClient(
        Config.getInstance(
          config.coinbase.keys[0].name,
          config.coinbase.keys[0].privateKey,
          config.coinbase.baseUrl
        )
      );

      // Fetch products
      const productsData = await client.products?.listProducts();
      console.log("Fetched products data:", productsData);

      if (!productsData?.products || productsData.products.length === 0) {
        throw new Error("No products found");
      }

      // Get the ID of the first product
      const productID = productsData.products[0].product_id;
      console.log("Fetching product by ID:", productID);
      
      // Fetch product by ID
      const productData = await client.products?.getProduct(productID);
      console.log("Fetched product data:", productData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  });

  it("should fetch best bid/ask for products", async () => {
    try {
      const client = new CoinbaseClient(
        Config.getInstance(
          config.coinbase.keys[0].name,
          config.coinbase.keys[0].privateKey,
          config.coinbase.baseUrl
        )
      );

      // Fetch products
      const productsData = await client.products?.listProducts();
      console.log("Fetched products data:", productsData);

      if (!productsData?.products || productsData.products.length === 0) {
        throw new Error("No products found");
      }

      // Get the ID of the first product
      const productID = productsData.products[0].product_id;
      console.log("Fetching product by ID:", productID);

      // Fetch best bid/ask data
      const bestBidAskData = await client.products?.getBestBidAsk([productID]);
      console.log("Fetched best bid/ask data:", bestBidAskData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  });
});
