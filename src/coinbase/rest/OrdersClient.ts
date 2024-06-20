import { randomBytes } from "crypto";
import BaseClient from "../BaseClient";
import { GetOrderResponse } from "./types/orders/GetOrderResponse";
import { ListOrdersResponse } from "./types/orders/ListOrdersResponse";
import { EditOrderResponse } from "./types/orders/EditOrderResponse";
import { CancelOrdersResponse } from "./types/orders/CancelOrdersResponse";
import { CreateOrderResponse } from "./types/orders/CreateOrderResponse";
import { ListFillsResponse } from "./types/orders/ListFillsResponse";
import { PreviewOrderResponse } from './types/orders/PreviewOrder';

class OrdersClient extends BaseClient {
  async generateClientOrderID(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const randomPart = randomBytes(8).toString("hex");
    return `${timestamp}-${randomPart}`;
  }

  async createOrder(orderData: object): Promise<CreateOrderResponse> {
    return await this.postRequest(`/orders`, orderData);
  }

  async createBuyOrder(
    productID: string,
    baseSize: string,
    clientOrderID: string,
    orderConfig: { limit_price: string; end_time: string; post_only?: boolean }
  ): Promise<CreateOrderResponse> {
    const orderData = {
      client_order_id: clientOrderID,
      product_id: productID,
      side: "BUY",
      order_configuration: {
        limit_limit_gtd: {
          limit_price: orderConfig.limit_price,
          post_only: orderConfig.post_only || false,
          end_time: orderConfig.end_time,
          base_size: baseSize,
        },
      },
    };
    return await this.createOrder(orderData);
  }

  async createSellOrder(
    productID: string,
    baseSize: string,
    clientOrderID: string,
    orderConfig: { limit_price: string; end_time: string; post_only?: boolean }
  ): Promise<CreateOrderResponse> {
    const orderData = {
      client_order_id: clientOrderID,
      product_id: productID,
      side: "SELL",
      order_configuration: {
        limit_limit_gtd: {
          limit_price: orderConfig.limit_price,
          post_only: orderConfig.post_only || false,
          end_time: orderConfig.end_time,
          base_size: baseSize,
        },
      },
    };
    return await this.createOrder(orderData);
  }

  async previewOrder(orderData: object): Promise<PreviewOrderResponse> {
    return await this.postRequest(`/orders/preview`, orderData);
  }

  async previewBuyOrder(
    product_id: string,
    base_size: string,
    client_order_id: string,
    order_configuration: {
      limit_price: string;
      end_time: string;
      post_only?: boolean;
    },
    commission_rate: string = "0.01"
  ): Promise<PreviewOrderResponse> {
    const orderData = {
      product_id,
      side: "BUY",
      commission_rate: {
        value: commission_rate,
      },
      order_configuration: {
        limit_limit_gtd: {
          limit_price: order_configuration.limit_price,
          post_only: order_configuration.post_only || false,
          end_time: order_configuration.end_time,
          base_size,
        },
      },
      client_order_id,
    };
    return await this.previewOrder(orderData);
  }

  async previewSellOrder(
    product_id: string,
    base_size: string,
    client_order_id: string,
    order_configuration: {
      limit_price: string;
      end_time: string;
      post_only?: boolean;
    },
    commission_rate: string = "0.01"
  ): Promise<PreviewOrderResponse> {
    const orderData = {
      product_id,
      side: "SELL",
      commission_rate: {
        value: commission_rate,
      },
      order_configuration: {
        limit_limit_gtd: {
          limit_price: order_configuration.limit_price,
          post_only: order_configuration.post_only || false,
          end_time: order_configuration.end_time,
          base_size,
        },
      },
      client_order_id,
    };
    return await this.previewOrder(orderData);
  }

  async cancelOrders(orderIDs: string[]): Promise<CancelOrdersResponse> {
    const data = { order_ids: orderIDs };
    return await this.postRequest(`/orders/batch_cancel`, data);
  }

  async editOrder(orderID: string, newData: object): Promise<EditOrderResponse> {
    const data = { order_id: orderID, ...newData };
    return await this.postRequest(`/orders/edit`, data);
  }

  async previewEditOrder(orderID: string, newData: object): Promise<PreviewOrderResponse> {
    const data = { order_id: orderID, ...newData };
    return await this.postRequest(`/orders/edit_preview`, data);
  }

  async listOrders(queryParams?: object): Promise<ListOrdersResponse> {
    let queryString = "";
    if (queryParams && Object.keys(queryParams).length > 0) {
      queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    }
    return await this.getRequest(`/orders/historical/batch`, queryString ? `?${queryString}` : "");
  }

  async listFills(queryParams?: object): Promise<ListFillsResponse> {
    let queryString = "";
    if (queryParams && Object.keys(queryParams).length > 0) {
      queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    }
    return await this.getRequest(`/orders/historical/fills`, queryString ? `?${queryString}` : "");
  }

  async getOrder(orderID: string): Promise<GetOrderResponse> {
    return await this.getRequest(`/orders/historical/${orderID}`);
  }
}

export default OrdersClient;
