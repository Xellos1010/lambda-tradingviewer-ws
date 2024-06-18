// Import necessary modules and classes
import BaseApiSpotService from "./provider/BaseApiSpotService";

// Replace with your desired symbol (e.g., 'BTC-USD')
const symbol = "BTC-USD";

// Create an instance of BaseApiSpotService
const spotService = new BaseApiSpotService(symbol);

(async () => {
  try {
    // Example usage of methods from BaseApiSpotService
    const balance = await spotService.getBalance("BTC");
    console.log("Balance:", balance);

    const price = await spotService.getPrice();
    console.log("Price:", price);

    // const quantity = 0.001; // Replace with your desired quantity
    // const sellPrice = price * 1.01; // Adjust the price as needed
    // const buyPrice = price * 0.99; // Adjust the price as needed

    // Example of placing limit orders
    // await spotService.limitSell(quantity, sellPrice);
    // await spotService.limitBuy(quantity, buyPrice);

    // // Example of placing market orders
    // await spotService.marketSell(quantity);
    // await spotService.marketBuy(quantity);

    // // Replace with an actual order ID to check its status
    // const orderId = "your-order-id";
    // const orderStatus = await spotService.checkStatus(orderId);
    // console.log("Order Status:", orderStatus);

    // // Replace with an actual order ID to cancel an order
    // const orderToCancel = "order-id-to-cancel";
    // await spotService.cancelOrder(orderToCancel);
  } catch (error) {
    console.error("Error:", error);
  }
})();
