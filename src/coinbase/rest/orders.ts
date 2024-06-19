import { getRequest, postRequest } from "./utils/apiUtils";
import { randomBytes } from "crypto";

const generateClientOrderID = (): string => {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
  const randomPart = randomBytes(8).toString("hex"); // Using 8 bytes for a shorter random part
  return `${timestamp}-${randomPart}`;
};

const createOrder = async (orderData: object) => {
  return await postRequest(`/orders`, orderData);
};

const createBuyOrder = async (
  productID: string,
  baseSize: string,
  clientOrderID: string,
  orderConfig: { limit_price: string; end_time: string; post_only?: boolean }
) => {
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
  return await createOrder(orderData);
};

const createSellOrder = async (
  productID: string,
  baseSize: string,
  clientOrderID: string,
  orderConfig: { limit_price: string; end_time: string; post_only?: boolean }
) => {
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
  return await createOrder(orderData);
};

const previewOrder = async (orderData: object) => {
  return await postRequest(`/orders/preview`, orderData);
};

const previewBuyOrder = async (
  product_id: string,
  base_size: string,
  client_order_id: string,
  order_configuration: {
    limit_price: string;
    end_time: string;
    post_only?: boolean;
  },
  commission_rate: string = "0.01"
) => {
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
  return await previewOrder(orderData);
};

const previewSellOrder = async (
  product_id: string,
  base_size: string,
  client_order_id: string,
  order_configuration: {
    limit_price: string;
    end_time: string;
    post_only?: boolean;
  },
  commission_rate: string = "0.01"
) => {
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
  return await previewOrder(orderData);
};

const cancelOrders = async (orderIDs: string[]) => {
  const data = { order_ids: orderIDs };
  return await postRequest(`/orders/batch_cancel`, data);
};

const editOrder = async (orderID: string, newData: object) => {
  const data = { order_id: orderID, ...newData };
  return await postRequest(`/orders/edit`, data);
};

const previewEditOrder = async (orderID: string, newData: object) => {
  const data = { order_id: orderID, ...newData };
  return await postRequest(`/orders/edit_preview`, data);
};

const listOrders = async (queryParams?: object) => {
  let queryString = "";
  if (queryParams && Object.keys(queryParams).length > 0) {
    queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }
  return await getRequest(
    `/orders/historical/batch`,
    `${queryString ? `?${queryString}` : ""}`
  );
};

const listFills = async (queryParams?: object) => {
  let queryString = "";
  if (queryParams && Object.keys(queryParams).length > 0) {
    queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }
  return await getRequest(
    `/orders/historical/fills`,
    `${queryString ? `?${queryString}` : ""}`
  );
};

const getOrder = async (orderID: string) => {
  return await getRequest(`/orders/historical/${orderID}`);
};

export {
  generateClientOrderID,
  createSellOrder,
  createBuyOrder,
  cancelOrders,
  editOrder,
  previewEditOrder,
  listOrders,
  listFills,
  getOrder,
  previewSellOrder,
  previewBuyOrder,
};
