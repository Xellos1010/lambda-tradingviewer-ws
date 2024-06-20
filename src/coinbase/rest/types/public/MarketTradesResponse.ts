// src\coinbase\rest\types\public\MarketTradesResponse.ts

import { Trade } from "./Trade";

export interface MarketTradesResponse {
  trades: Trade[];
  best_bid: string;
  best_ask: string;
}
