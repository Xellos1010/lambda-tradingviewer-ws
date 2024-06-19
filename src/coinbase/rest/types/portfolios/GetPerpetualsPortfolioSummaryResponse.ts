export interface MonetaryAmount {
    value: string;
    currency: string;
  }
  
  export interface Portfolio {
    portfolio_uuid: string;
    collateral: string;
    position_notional: string;
    open_position_notional: string;
    pending_fees: string;
    borrow: string;
    accrued_interest: string;
    rolling_debt: string;
    portfolio_initial_margin: string;
    portfolio_im_notional: MonetaryAmount;
    portfolio_maintenance_margin: string;
    portfolio_mm_notional: MonetaryAmount;
    liquidation_percentage: string;
    liquidation_buffer: string;
    margin_type: "MARGIN_TYPE_UNSPECIFIED" | "MARGIN_TYPE_CROSS" | "MARGIN_TYPE_ISOLATED";
    margin_flags: "PORTFOLIO_MARGIN_FLAGS_UNSPECIFIED" | "PORTFOLIO_MARGIN_FLAGS_IN_LIQUIDATION";
    liquidation_status: "PORTFOLIO_LIQUIDATION_STATUS_UNSPECIFIED" | "PORTFOLIO_LIQUIDATION_STATUS_CANCELING" | "PORTFOLIO_LIQUIDATION_STATUS_AUTO_LIQUIDATING" | "PORTFOLIO_LIQUIDATION_STATUS_LSP_ASSIGNMENT" | "PORTFOLIO_LIQUIDATION_STATUS_CUSTOMER_ASSIGNMENT" | "PORTFOLIO_LIQUIDATION_STATUS_MANUAL" | "PORTFOLIO_LIQUIDATION_STATUS_NOT_LIQUIDATING";
    unrealized_pnl: MonetaryAmount;
    total_balance: MonetaryAmount;
    summary: {
      unrealized_pnl: MonetaryAmount;
      buying_power: MonetaryAmount;
      total_balance: MonetaryAmount;
      max_withdrawal_amount: MonetaryAmount;
    };
  }
  
  export interface GetPerpetualsPortfolioSummaryResponse {
    portfolios: Portfolio[];
  }
  