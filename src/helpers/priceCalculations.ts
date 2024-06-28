import { GetMarketTradesResponse } from "coinbase-advanced-node-ts/dist/rest/types/products/GetMarketTrades";

// Helper function to calculate the buy price based on market data and buy size
export function calculateBuyPrice(marketData: GetMarketTradesResponse, buySize: number, percentage: number = 0): number {
  return calculateOptimalBuyPrice(marketData, buySize, percentage);
}

// Helper function to calculate the optimal buy price
// TODO: There needs to be a slippage calculation whereby for 1 second we determine the velocity of the market and set the entry price to a place that can be met. There is an extra fee being a taker but our signals right now are always on the reversal candle so there is no guarentee the entry order will be filled when the signal is raised.
export function calculateOptimalBuyPrice(marketTrades: GetMarketTradesResponse, buySize: number, bufferPercentage: number = 0): number {
  const adjustedBuySize = buySize * (1 + bufferPercentage);
  const sortedTrades = marketTrades.trades.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  let accumulatedSize = 0;
  for (const trade of sortedTrades) {
    accumulatedSize += parseFloat(trade.size);
    if (accumulatedSize >= adjustedBuySize) {
      return parseFloat(trade.price);
    }
  }
  return parseFloat(marketTrades.best_ask); // Fallback to the best ask price
}

// Helper function to calculate the sell price based on market data and sell size
export function calculateSellPrice(marketData: GetMarketTradesResponse, sellSize: number, bufferPercentage: number = 0): number {
  return calculateOptimalSellPrice(marketData, sellSize, bufferPercentage);
}

// Helper function to calculate the optimal sell price
// TODO: There needs to be a slippage calculation whereby for 1 second we determine the velocity of the market and set the exit price to a place that can be met. There is an extra fee being a taker but our signals right now are always on the reversal candle so there is no guarentee the exit order will be filled when the signal is raised.
export function calculateOptimalSellPrice(marketTrades: GetMarketTradesResponse, sellSize: number, bufferPercentage: number = 0): number {
  const adjustedSellSize = sellSize * (1 + bufferPercentage);
  const sortedTrades = marketTrades.trades.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  let accumulatedSize = 0;
  for (const trade of sortedTrades) {
    accumulatedSize += parseFloat(trade.size);
    if (accumulatedSize >= adjustedSellSize) {
      return parseFloat(trade.price);
    }
  }
  return parseFloat(marketTrades.best_bid); // Fallback to the best bid price
}
