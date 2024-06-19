export interface Fill {
    entry_id: string;
    trade_id: string;
    order_id: string;
    trade_time: string;
    trade_type: "FILL" | "REVERSAL" | "CORRECTION" | "SYNTHETIC";
    price: string;
    size: string;
    commission: string;
    product_id: string;
    sequence_timestamp: string;
    liquidity_indicator: "UNKNOWN_LIQUIDITY_INDICATOR" | "MAKER" | "TAKER";
    size_in_quote: boolean;
    user_id: string;
    side: "BUY" | "SELL";
    retail_portfolio_id: string;
  }
  
