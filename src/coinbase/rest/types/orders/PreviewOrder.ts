export interface PreviewOrderResponse {
    order_total: string;
    commission_total: string;
    errs: string[];
    warning: string[];
    quote_size: string;
    base_size: string;
    best_bid: string;
    best_ask: string;
    is_max: boolean;
    order_margin_total?: string;
    leverage?: string;
    long_leverage?: string;
    short_leverage?: string;
    slippage?: string;
  }
  