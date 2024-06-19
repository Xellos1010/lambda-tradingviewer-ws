// src/coinbase/coinbaseClient.ts
import { createSellOrder, createBuyOrder, generateClientOrderID, cancelOrders, getOrder } from './rest/orders';
import { getBestBidAsk, listProducts, getProduct, getProductBook, getMarketTrades } from './rest/products';
import { listAccounts, getAccount } from './rest/accounts';

class CoinbaseClient {
  private keyName: string;
  private keySecret: string;
  private baseUrl: string;

  constructor(keyName: string, keySecret: string, baseUrl: string) {
    this.keyName = keyName;
    this.keySecret = keySecret;
    this.baseUrl = baseUrl;
  }

  // Orders API
  async createSellOrder(productID: string, baseSize: string, clientOrderID: string, orderConfig: { limit_price: string; end_time: string; post_only?: boolean }) {
    return await createSellOrder(productID, baseSize, clientOrderID, orderConfig);
  }

  async createBuyOrder(productID: string, baseSize: string, clientOrderID: string, orderConfig: { limit_price: string; end_time: string; post_only?: boolean }) {
    return await createBuyOrder(productID, baseSize, clientOrderID, orderConfig);
  }

  async generateClientOrderID() {
    return generateClientOrderID();
  }

  async cancelOrders(orderIDs: string[]) {
    return await cancelOrders(orderIDs);
  }

  async getOrder(orderID: string) {
    return await getOrder(orderID);
  }

  // Products API
  async getBestBidAsk(productIDs?: string[]) {
    return await getBestBidAsk(productIDs);
  }

  async listProducts() {
    return await listProducts();
  }

  async getProduct(productID: string) {
    return await getProduct(productID);
  }

  async getProductBook(queryParams: object = {}) {
    return await getProductBook(queryParams);
  }

  async getMarketTrades(productID: string, queryParams: object = {}) {
    return await getMarketTrades(productID, queryParams);
  }

  // Accounts API
  async listAccounts() {
    return await listAccounts();
  }

  async getAccount(accountUUID: string) {
    return await getAccount(accountUUID);
  }
}

export default CoinbaseClient;
