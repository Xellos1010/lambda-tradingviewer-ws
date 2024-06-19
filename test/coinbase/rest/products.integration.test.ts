import { listProducts, getProduct } from "../../../src/coinbase/rest/products";
import { getBestBidAsk } from "../../../src/coinbase/rest/products";
// import { listProducts, getProduct, getBestBidAsk, getProductBook, getProductCandles, getMarketTrades } from '../src/coinbase/utils/apiUtils';

describe("Coinbase API Integration Test - Products", () => {
  it("should fetch products and then fetch a product by ID", async () => {
    try {
      // Fetch products
      const productsData = await listProducts();
      console.log("Fetched products data:", productsData);

      // Get the ID of the first product
      const productID = productsData.products[0].product_id;
      console.log("Fetching product by ID:", productID);
      // Fetch product by ID
      const productData = await getProduct(productID);
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
      // Fetch products
      const productsData = await listProducts();
      console.log("Fetched products data:", productsData);

      // Get the ID of the first product
      const productID = productsData.products[0].product_id;
      console.log("Fetching product by ID:", productID);
      // const bestBidAskData = await getBestBidAsk();
      const bestBidAskData = await getBestBidAsk([productID]);
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
