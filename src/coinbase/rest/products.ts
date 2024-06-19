import { getRequest } from "./utils/apiUtils";

const getBestBidAsk = async (productIDs?: string[]) => {
  let queryString = "";
  if (productIDs && productIDs.length > 0) {
    queryString = productIDs.map((id) => `product_ids=${id}`).join("&");
  }
  return await getRequest(
    "/best_bid_ask",
    `${queryString ? `?${queryString}` : ""}`
  );
};

const listProducts = async () => {
  return await getRequest(`/products`);
};

const getProduct = async (productID: string) => {
  return await getRequest(`/products/${productID}`);
};

const getProductCandles = async (productID: string, queryParams?: object) => {
  let queryString = "";
  if (queryParams && Object.keys(queryParams).length > 0) {
    queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }
  return await getRequest(
    `/products/${productID}/candles`,
    `${queryString ? `?${queryString}` : ""}`
  );
};

const getMarketTrades = async (productID: string, queryParams?: object) => {
  let queryString = "";
  if (queryParams && Object.keys(queryParams).length > 0) {
    queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }
  return await getRequest(
    `/products/${productID}/ticker`,
    `${queryString ? `?${queryString}` : ""}`
  );
};

const getProductBook = async (queryParams?: object) => {
  let queryString = "";
  if (queryParams && Object.keys(queryParams).length > 0) {
    queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }
  return await getRequest(
    `/product_book`,
    `${queryString ? `?${queryString}` : ""}`
  );
};

export {
  getBestBidAsk,
  getProductBook,
  listProducts,
  getProduct,
  getProductCandles,
  getMarketTrades,
};
