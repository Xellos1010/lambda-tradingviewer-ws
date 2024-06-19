export interface Trade {
  trade_id: string;
  product_id: string;
  price: string;
  size: string;
  time: string;
  side: "BUY" | "SELL";
  bid: string;
  ask: string;
  best_bid: string;
  best_ask: string;
}
