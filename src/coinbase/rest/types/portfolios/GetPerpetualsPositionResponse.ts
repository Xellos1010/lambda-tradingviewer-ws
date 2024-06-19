export interface MonetaryAmount {
    value: string;
    currency: string;
  }
  
  export interface Position {
    product_id: string;
    product_uuid: string;
    portfolio_uuid: string;
    symbol: string;
    vwap: MonetaryAmount;
    entry_vwap: MonetaryAmount;
    position_side: "POSITION_SIDE_UNKNOWN" | "POSITION_SIDE_LONG" | "POSITION_SIDE_SHORT";
    margin_type: "MARGIN_TYPE_UNSPECIFIED" | "MARGIN_TYPE_CROSS" | "MARGIN_TYPE_ISOLATED";
    net_size: string;
    buy_order_size: string;
    sell_order_size: string;
    im_contribution: string;
    unrealized_pnl: MonetaryAmount;
    mark_price: MonetaryAmount;
    liquidation_price: MonetaryAmount;
    leverage: string;
    im_notional: MonetaryAmount;
    mm_notional: MonetaryAmount;
    position_notional: string;
    aggregated_pnl: MonetaryAmount;
  }
  
  export interface GetPerpetualsPositionResponse {
    position: Position;
  }
  