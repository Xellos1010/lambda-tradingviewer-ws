import {
  createBuyOrder,
  generateClientOrderID,
  cancelOrders,
} from "../../../src/coinbase/rest/orders";

describe("Coinbase API Integration Test - Orders", () => {
  it("should create a buy order, preview it, edit it, and then cancel it", async () => {
    try {
      // Generate a unique order ID
      const uniqueOrderId = generateClientOrderID();
      // Calculate the end time to be +1 minute from now
      const endTime = new Date(Date.now() + 1 * 60 * 1000).toISOString();
      // Create a buy order
      const buyOrderConfig = {
        limit_price: "20000.00",
        end_time: endTime,
      };

      const createOrderResponse = await createBuyOrder(
        "BTC-USD",
        "0.00001", // The amount of BTC you want to purchase
        uniqueOrderId,
        buyOrderConfig
      );
      console.log("Created buy order response:", createOrderResponse);

      // Edit the order
      const orderID = createOrderResponse.order_id;
      const editData = {
        price: "21000.00",
        size: "0.00002",
      };

      // Cancel the order
      const cancelOrderResponse = await cancelOrders([orderID]);
      console.log("Cancelled order response:", cancelOrderResponse);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  });
});
