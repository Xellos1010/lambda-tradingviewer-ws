export interface MonetaryAmount {
    value: string;
    currency: string;
  }
  
  export interface SpotPosition {
    asset: string;
    account_uuid: string;
    total_balance_fiat: number;
    total_balance_crypto: number;
    available_to_trade_fiat: number;
    allocation: number;
    one_day_change: number;
    cost_basis: MonetaryAmount;
    asset_img_url: string;
    is_cash: boolean;
  }
  
  export interface PerpPosition {
    product_id: string;
    product_uuid: string;
    symbol: string;
    asset_image_url: string;
    vwap: MonetaryAmount;
    userNativeCurrency: MonetaryAmount;
    rawCurrency: MonetaryAmount;
    position_side: "FUTURES_POSITION_SIDE_UNSPECIFIED" | "FUTURES_POSITION_SIDE_LONG" | "FUTURES_POSITION_SIDE_SHORT";
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
    position_notional: MonetaryAmount;
    margin_type: "MARGIN_TYPE_UNSPECIFIED" | "MARGIN_TYPE_CROSS" | "MARGIN_TYPE_ISOLATED";
    liquidation_buffer: string;
    liquidation_percentage: string;
  }
  
  export interface FuturesPosition {
    product_id: string;
    contract_size: string;
    side: "FUTURES_POSITION_SIDE_UNSPECIFIED" | "FUTURES_POSITION_SIDE_LONG" | "FUTURES_POSITION_SIDE_SHORT";
    amount: string;
    avg_entry_price: string;
    current_price: string;
    unrealized_pnl: string;
    expiry: string;
    underlying_asset: string;
    asset_img_url: string;
    product_name: string;
    venue: string;
    notional_value: string;
  }
  
  export interface Portfolio {
    name: string;
    uuid: string;
    type: "UNDEFINED" | "DEFAULT" | "CONSUMER" | "INTX";
    deleted: boolean;
  }
  
  export interface PortfolioBalances {
    total_balance: MonetaryAmount;
    total_futures_balance: MonetaryAmount;
    total_cash_equivalent_balance: MonetaryAmount;
    total_crypto_balance: MonetaryAmount;
    futures_unrealized_pnl: MonetaryAmount;
    perp_unrealized_pnl: MonetaryAmount;
  }
  
  export interface Breakdown {
    portfolio: Portfolio;
    portfolio_balances: PortfolioBalances;
    spot_positions: SpotPosition[];
    perp_positions: PerpPosition[];
    futures_positions: FuturesPosition[];
  }
  
  export interface GetPortfolioBreakdownResponse {
    breakdown: Breakdown;
  }
  