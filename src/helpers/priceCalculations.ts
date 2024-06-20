import { GetMarketTradesResponse } from '../coinbase/rest/types/products/GetMarketTrades';

// Helper function to calculate the buy price based on market data and buy size
export function calculateBuyPrice(marketData: GetMarketTradesResponse, buySize: number, percentage: number = 0): number {
  return calculateOptimalBuyPrice(marketData, buySize, percentage);
}

// Helper function to calculate the optimal buy price
export function calculateOptimalBuyPrice(marketTrades: GetMarketTradesResponse, buySize: number, percentage: number = 0): number {
  const adjustedBuySize = buySize * (1 + percentage);
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
export function calculateSellPrice(marketData: GetMarketTradesResponse, sellSize: number, percentage: number = 0): number {
  return calculateOptimalSellPrice(marketData, sellSize, percentage);
}

// Helper function to calculate the optimal sell price
export function calculateOptimalSellPrice(marketTrades: GetMarketTradesResponse, sellSize: number, percentage: number = 0): number {
  const adjustedSellSize = sellSize * (1 + percentage);
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
