import {
  // createSellOrder,
  // createBuyOrder,
  // generateClientOrderID,
  // cancelOrders,
  // editOrder,
  // previewEditOrder,
  // previewSellOrder,
  // previewBuyOrder,
  listOrders,
  listFills,
  getOrder,
} from '../../../src/coinbase/rest/orders';

describe('Coinbase API Integration Test - Orders', () => {
  // it('should create a buy order, preview it, edit it, and then cancel it', async () => {
  //   try {
  //     // Generate a unique order ID
  //     const uniqueOrderId = generateClientOrderID();
  //     // Calculate the end time to be +1 minute from now
  //     const endTime = new Date(Date.now() + 1 * 60 * 1000).toISOString();
  //     // Create a buy order
  //     const createOrderResponse = await createBuyOrder(
  //       'BTC-USD',
  //       '0.01',
  //       uniqueOrderId,
  //       { limit_limit_gtd: { limit_price: '20000.00', end_time: endTime } }
  //     );
  //     console.log('Created buy order response:', createOrderResponse);

  //     // Preview the buy order
  //     const previewBuyOrderResponse = await previewBuyOrder(
  //       'BTC-USD',
  //       '0.01',
  //       uniqueOrderId,
  //       { limit_limit_gtd: { limit_price: '20000.00', end_time: endTime } }
  //     );
  //     console.log('Preview buy order response:', previewBuyOrderResponse);

  //     // Edit the order
  //     const orderID = createOrderResponse.order_id;
  //     const editData = {
  //       price: '21000.00',
  //       size: '0.02'
  //     };
  //     const editOrderResponse = await editOrder(orderID, editData);
  //     console.log('Edited order response:', editOrderResponse);

  //     // Preview the edit
  //     const previewEditResponse = await previewEditOrder(orderID, editData);
  //     console.log('Preview edit order response:', previewEditResponse);

  //     // Cancel the order
  //     const cancelOrderResponse = await cancelOrders([orderID]);
  //     console.log('Cancelled order response:', cancelOrderResponse);

  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error('Error calling Coinbase API:', error.message);
  //     } else {
  //       console.error('Unexpected error:', error);
  //     }
  //   }
  // });

  it('should list orders and fills, and get an order by ID', async () => {
    try {
      // List orders
      const listOrdersResponse = await listOrders();
      console.log('List orders response:', JSON.stringify(listOrdersResponse, null, 2));

      // List fills
      const listFillsResponse = await listFills();
      console.log('List fills response:', JSON.stringify(listFillsResponse, null, 2));

      // Get an order by ID
      if (listOrdersResponse.orders && listOrdersResponse.orders.length > 0) {
        const orderID = listOrdersResponse.orders[0].order_id;
        const getOrderResponse = await getOrder(orderID);
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
