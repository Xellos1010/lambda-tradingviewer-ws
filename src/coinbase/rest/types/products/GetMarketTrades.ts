import { Trade } from "./Trade";

  export interface GetMarketTradesResponse {
    trades: Trade[];
    best_bid: string;
    best_ask: string;
  }
  