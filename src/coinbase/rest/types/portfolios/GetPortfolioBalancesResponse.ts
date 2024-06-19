export interface Asset {
    asset_id: string;
    asset_uuid: string;
    asset_name: string;
    status: string;
    collateral_weight: string;
    account_collateral_limit: string;
    ecosystem_collateral_limit_breached: boolean;
    asset_icon_url: string;
    supported_networks_enabled: boolean;
    quantity: string;
    hold: string;
    transfer_hold: string;
    collateral_value: string;
    max_withdraw_amount: string;
    loan: string;
    loan_collateral_requirement_usd: string;
    pledged_quantity: string;
    is_margin_limit_reached: boolean;
  }
  
  export interface Balance {
    asset: Asset;
    portfolio_uuid: string;
  }
  
  export interface PortfolioBalance {
    portfolio_uuid: string;
    balances: Balance[];
  }
  
  export interface GetPortfolioBalancesResponse {
    portfolio_balances: PortfolioBalance[];
  }
  