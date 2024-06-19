import { BidAsk } from "./BidAsk";


export interface PriceBook {
  product_id: string;
  bids: BidAsk[];
  asks: BidAsk[];
  time: string;
}
