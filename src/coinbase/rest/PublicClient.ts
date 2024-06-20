// src/coinbase/rest/PublicClient.ts
import BaseClient from '../BaseClient';
import { MarketTradesResponse } from './types/public/MarketTradesResponse';
import { ServerTimeResponse } from './types/public/ServerTimeResponse';
import { ProductBookResponse } from './types/public/ProductBookResponse';
import { ProductsResponse } from './types/public/ProductsResponse';
import { ProductResponse } from './types/public/ProductResponse';
import { ProductCandlesResponse } from './types/public/ProductCandlesResponse';

class PublicClient extends BaseClient {

  async getServerTime(): Promise<ServerTimeResponse> {
    return await this.getPublicRequest("/api/v3/brokerage/time");
  }

  async getProductBook(productID: string, limit?: number): Promise<ProductBookResponse> {
    const queryParams = new URLSearchParams({ product_id: productID });
    if (limit) queryParams.append("limit", limit.toString());
    return await this.getPublicRequest(`/api/v3/brokerage/market/product_book?${queryParams.toString()}`);
  }

  async listProducts(): Promise<ProductsResponse> {
    return await this.getPublicRequest("/api/v3/brokerage/market/products");
  }

  async getProduct(productID: string): Promise<ProductResponse> {
    return await this.getPublicRequest(`/api/v3/brokerage/market/products/${productID}`);
  }

  async getProductCandles(productID: string, start: string, end: string, granularity: string): Promise<ProductCandlesResponse> {
    const queryParams = new URLSearchParams({ start, end, granularity });
    return await this.getPublicRequest(`/api/v3/brokerage/market/products/${productID}/candles?${queryParams.toString()}`);
  }

  async getMarketTrades(productID: string, limit: number): Promise<MarketTradesResponse> {
    const queryParams = new URLSearchParams({ limit: limit.toString() });
    return await this.getPublicRequest(`/api/v3/brokerage/market/products/${productID}/ticker?${queryParams.toString()}`);
  }
}

export default PublicClient;
