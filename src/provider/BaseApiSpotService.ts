import axios, { AxiosInstance } from 'axios';
import { generateJWT } from '../coinbase/auth/generateJWT';

export default class BaseApiSpotService {
  symbol: string;
  client: AxiosInstance;

constructor(symbol: string) {
    this.symbol = symbol;
    this.client = axios.create({
      baseURL: 'https://api.coinbase.com/api/v3/brokerage',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async request(method: string, path: string, data?: object) {
    const token = generateJWT(method, path);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await this.client.request({
      method,
      url: path,
      data,
      headers,
    });
    return response.data;
  }

  async getBalance(currency: string): Promise<{ total: number; available: number; onOrder: number }> {
    const accounts = await this.request('GET', '/accounts');
    const account = accounts.find((acc: any) => acc.currency === currency);
    const available = Number(account?.available_balance || 0);
    const total = Number(account?.balance || 0);
    const onOrder = total - available;
    return { total, available, onOrder };
  }

  async getPrice(): Promise<number> {
    const productId = this.symbol.replace('-', '');
    const ticker = await this.request('GET', `/products/${productId}/ticker`);
    return Number(ticker.price);
  }

  async limitSell(quantity: number, price: number): Promise<unknown> {
    const order = {
      product_id: this.symbol,
      side: 'SELL',
      price: price.toFixed(2),
      size: quantity.toFixed(3),
      type: 'LIMIT',
    };
    return this.request('POST', '/orders', order);
  }

  async limitBuy(quantity: number, price: number): Promise<unknown> {
    const order = {
      product_id: this.symbol,
      side: 'BUY',
      price: price.toFixed(2),
      size: quantity.toFixed(3),
      type: 'LIMIT',
    };
    return this.request('POST', '/orders', order);
  }

  async marketSell(quantity: number): Promise<unknown> {
    const order = {
      product_id: this.symbol,
      side: 'SELL',
      type: 'MARKET',
      size: quantity.toFixed(5),
    };
    return this.request('POST', '/orders', order);
  }

  async marketBuy(quantity: number): Promise<unknown> {
    const order = {
      product_id: this.symbol,
      side: 'BUY',
      type: 'MARKET',
      size: quantity.toFixed(5),
    };
    return this.request('POST', '/orders', order);
  }

  async checkStatus(orderId: string): Promise<string> {
    const order = await this.request('GET', `/orders/historical/${orderId}`);
    return order.status;
  }

  async cancelOrder(orderId: string | undefined): Promise<unknown> {
    if (!orderId) {
      return;
    }
    return this.request('POST', `/orders/batch_cancel`, { order_ids: [orderId] });
  }
}
