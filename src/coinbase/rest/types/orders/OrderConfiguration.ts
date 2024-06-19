export interface OrderConfiguration {
  market_market_ioc?: {
    quote_size: string;
    base_size: string;
  };
  sor_limit_ioc?: {
    base_size: string;
    limit_price: string;
  };
  limit_limit_gtc?: {
    base_size: string;
    limit_price: string;
    post_only: boolean;
  };
  limit_limit_gtd?: {
    base_size: string;
    limit_price: string;
    end_time: string;
    post_only: boolean;
  };
  limit_limit_fok?: {
    base_size: string;
    limit_price: string;
  };
  stop_limit_stop_limit_gtc?: {
    base_size: string;
    limit_price: string;
    stop_price: string;
    stop_direction: "STOP_DIRECTION_STOP_UP" | "STOP_DIRECTION_STOP_DOWN";
  };
  stop_limit_stop_limit_gtd?: {
    base_size: string;
    limit_price: string;
    stop_price: string;
    end_time: string;
    stop_direction: "STOP_DIRECTION_STOP_UP" | "STOP_DIRECTION_STOP_DOWN";
  };
  trigger_bracket_gtc?: {
    base_size: string;
    limit_price: string;
    stop_trigger_price: string;
  };
  trigger_bracket_gtd?: {
    base_size: string;
    limit_price: string;
    stop_trigger_price: string;
    end_time: string;
  };
}
