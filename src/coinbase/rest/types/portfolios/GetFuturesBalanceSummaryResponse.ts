export interface MonetaryAmount {
    value: string;
    currency: string;
  }
  
  export interface BalanceSummary {
    futures_buying_power: MonetaryAmount;
    total_usd_balance: MonetaryAmount;
    cbi_usd_balance: MonetaryAmount;
    cfm_usd_balance: MonetaryAmount;
    total_open_orders_hold_amount: MonetaryAmount;
    unrealized_pnl: MonetaryAmount;
    daily_realized_pnl: MonetaryAmount;
    initial_margin: MonetaryAmount;
    available_margin: MonetaryAmount;
    liquidation_threshold: MonetaryAmount;
    liquidation_buffer_amount: MonetaryAmount;
    liquidation_buffer_percentage: string;
    intraday_margin_window_measure: MarginWindowMeasure;
    overnight_margin_window_measure: MarginWindowMeasure;
  }
  
  export interface MarginWindowMeasure {
    margin_window_type: "UNSPECIFIED" | "OVERNIGHT" | "WEEKEND" | "INTRADAY" | "TRANSITION";
    margin_level: "UNSPECIFIED" | "BASE" | "WARNING" | "DANGER" | "LIQUIDATION";
    initial_margin: string;
    maintenance_margin: string;
    liquidation_buffer: string;
    total_hold: string;
    futures_buying_power: string;
  }
  
  export interface GetFuturesBalanceSummaryResponse {
    balance_summary: BalanceSummary;
  }
  