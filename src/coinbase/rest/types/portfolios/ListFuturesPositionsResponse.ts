export interface FuturesPosition {
    product_id: string;
    expiration_time: string;
    side: "UNKNOWN" | "LONG" | "SHORT";
    number_of_contracts: string;
    current_price: string;
    avg_entry_price: string;
    unrealized_pnl: string;
    daily_realized_pnl: string;
  }
  
  export interface ListFuturesPositionsResponse {
    positions: FuturesPosition[];
  }
  