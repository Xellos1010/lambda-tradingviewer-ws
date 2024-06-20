import BaseClient from "../BaseClient";
import { GetBestBidAskResponse } from "./types/products/GetBestBidAskResponse";
import { ListProductsResponse } from "./types/products/ListProductsResponse";
import { GetProductResponse } from "./types/products/GetProductResponse";
import { GetProductCandlesResponse } from "./types/products/GetProductCandlesResponse";
import { GetMarketTradesResponse } from './types/products/GetMarketTrades';
import { GetProductBookResponse } from "./types/products/GetProductBookResponse";

class ProductsClient extends BaseClient {
  async getBestBidAsk(productIDs?: string[]): Promise<GetBestBidAskResponse> {
    let queryString = "";
    if (productIDs && productIDs.length > 0) {
      queryString = productIDs.map((id) => `product_ids=${id}`).join("&");
    }
    return await this.getRequest(
      "/best_bid_ask",
      `${queryString ? `?${queryString}` : ""}`
    );
  }

  async listProducts(): Promise<ListProductsResponse> {
    return await this.getRequest(`/products`);
  }

  async getProduct(productID: string): Promise<GetProductResponse> {
    return await this.getRequest(`/products/${productID}`);
  }

  async getProductCandles(productID: string, queryParams?: object): Promise<GetProductCandlesResponse> {
    let queryString = "";
    if (queryParams && Object.keys(queryParams).length > 0) {
      queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    }
    return await this.getRequest(
      `/products/${productID}/candles`,
      `${queryString ? `?${queryString}` : ""}`
    );
  }

  async getMarketTrades(productID: string, queryParams?: object): Promise<GetMarketTradesResponse> {
    let queryString = "";
    if (queryParams && Object.keys(queryParams).length > 0) {
      queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    }
    return await this.getRequest(
      `/products/${productID}/ticker`,
      `${queryString ? `?${queryString}` : ""}`
    );
  }

  async getProductBook(queryParams?: object): Promise<GetProductBookResponse> {
    let queryString = "";
    if (queryParams && Object.keys(queryParams).length > 0) {
      queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    }
    return await this.getRequest(
      `/product_book`,
      `${queryString ? `?${queryString}` : ""}`
    );
  }
}

export default ProductsClient;
