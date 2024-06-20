import CoinbaseClient from "../../../src/coinbase/CoinbaseClient";
import config from "../../../src/config";
import Config from "../../../src/coinbase/config/Config";

describe('Coinbase API Integration Test - Orders', () => {
  it('should create a buy order, preview it, edit it, and then cancel it', async () => {
    try {
      const client = new CoinbaseClient(
        Config.getInstance(
          config.coinbase.keys[0].name,
          config.coinbase.keys[0].privateKey,
          config.coinbase.baseUrl
        )
      );

      // Generate a unique order ID
      const uniqueOrderId = await client.orders?.generateClientOrderID();
      if (!uniqueOrderId) {
        throw new Error("Failed to generate client order ID");
      }

      // Calculate the end time to be +1 minute from now
      const endTime = new Date(Date.now() + 1 * 60 * 1000).toISOString();
      const buyOrderConfig = {
        limit_price: "20000.00",
        end_time: endTime,
      };

      // Create a buy order
      const createOrderResponse = await client.orders?.createBuyOrder(
        "BTC-USD",
        "0.00001",
        uniqueOrderId,
        buyOrderConfig
      );
      console.log("Created buy order response:", createOrderResponse);

      // Edit the order
      const orderID = createOrderResponse?.order_id;
      if (!orderID) {
        throw new Error("Failed to get order ID");
      }

      // Cancel the order
      const cancelOrderResponse = await client.orders?.cancelOrders([orderID]);
      console.log("Cancelled order response:", cancelOrderResponse);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  });

  it('should list orders and fills, and get an order by ID', async () => {
    try {
      const client = new CoinbaseClient(
        Config.getInstance(
          config.coinbase.keys[0].name,
          config.coinbase.keys[0].privateKey,
          config.coinbase.baseUrl
        )
      );

      // List orders
      const listOrdersResponse = await client.orders?.listOrders();
      console.log('List orders response:', JSON.stringify(listOrdersResponse, null, 2));

      // List fills
      const listFillsResponse = await client.orders?.listFills();
      console.log('List fills response:', JSON.stringify(listFillsResponse, null, 2));

      // Get an order by ID
      if (listOrdersResponse?.orders && listOrdersResponse.orders.length > 0) {
        const orderID = listOrdersResponse.orders[0].order_id;
        const getOrderResponse = await client.orders?.getOrder(orderID);
        console.log('Get order response:', JSON.stringify(getOrderResponse, null, 2));
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error calling Coinbase API:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  });
});
