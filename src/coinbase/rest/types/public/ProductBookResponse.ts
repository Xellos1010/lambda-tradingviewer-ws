// src\coinbase\rest\types\public\ProductBookResponse.ts

import { PriceSize } from "./PriceSize";

export interface ProductBookResponse {
  product_id: string;
  bids: PriceSize[];
  asks: PriceSize[];
  time: string;
}
