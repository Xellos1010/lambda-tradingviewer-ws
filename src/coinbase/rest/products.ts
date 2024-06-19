import { getRequest } from "./utils/apiUtils";

const listOrders = async (queryParams: object = {}) => {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await getRequest(`/orders/historical/batch?${queryString}`);
  };
  
  const listFills = async (queryParams: object = {}) => {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await getRequest(`/orders/historical/fills?${queryString}`);
  };
  
  const getOrder = async (orderID: string) => {
    return await getRequest(`/orders/historical/${orderID}`);
  };
  
  const getBestBidAsk = async (productIDs?: string[]) => {
    let queryString = '';
    if (productIDs && productIDs.length > 0) {
      queryString = productIDs.map(id => `product_ids=${id}`).join('&');
    }
    return await getRequest("/best_bid_ask",`${queryString ? `?${queryString}` : ''}`);
  };
  
  const getProductBook = async (queryParams: object = {}) => {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await getRequest(`/product_book?${queryString}`);
  };
  
  const listProducts = async () => {
    return await getRequest(`/products`);
  };
  
  const getProduct = async (productID: string) => {
    return await getRequest(`/products/${productID}`);
  };
  
  const getProductCandles = async (productID: string, queryParams: object = {}) => {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await getRequest(`/products/${productID}/candles?${queryString}`);
  };
  
  const getMarketTrades = async (productID: string, queryParams: object = {}) => {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await getRequest(`/products/${productID}/ticker?${queryString}`);
  };

export {
  listOrders,
  listFills,
  getOrder,
  getBestBidAsk,
  getProductBook,
  listProducts,
  getProduct,
  getProductCandles,
  getMarketTrades,
};
