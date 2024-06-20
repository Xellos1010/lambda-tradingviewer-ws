import { GetMarketTradesResponse } from '../coinbase/rest/types/products/GetMarketTrades';

// Helper function to calculate the buy price based on market data
export function calculateBuyPrice(marketData: GetMarketTradesResponse): number {
  if (!marketData || !marketData.trades || marketData.trades.length === 0) {
    throw new Error("Market data is empty or invalid");
  }

  const bestBid = marketData.best_bid;
  if (!bestBid) {
    throw new Error("Best bid price is not available");
  }

  return parseFloat(bestBid);
}

// Helper function to calculate the sell price based on market data
export function calculateSellPrice(marketData: GetMarketTradesResponse): number {
  if (!marketData || !marketData.trades || marketData.trades.length === 0) {
    throw new Error("Market data is empty or invalid");
  }

  const bestAsk = marketData.best_ask;
  if (!bestAsk) {
    throw new Error("Best ask price is not available");
  }

  return parseFloat(bestAsk);
}
