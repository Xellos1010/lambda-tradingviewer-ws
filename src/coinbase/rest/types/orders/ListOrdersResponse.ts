import { OrderConfiguration } from "./OrderConfiguration";


export interface ListOrdersResponse {
  orders: {
    order_id: string;
    product_id: string;
    user_id: string;
    order_configuration: OrderConfiguration;
    side: "BUY" | "SELL";
    client_order_id: string;
    status: "OPEN" | "FILLED" | "CANCELLED" | "EXPIRED" | "FAILED" | "UNKNOWN_ORDER_STATUS";
    time_in_force: "UNKNOWN_TIME_IN_FORCE" | "GOOD_UNTIL_DATE_TIME" | "GOOD_UNTIL_CANCELLED" | "IMMEDIATE_OR_CANCEL" | "FILL_OR_KILL";
    created_time: string;
    completion_percentage: string;
    filled_size?: string;
    average_filled_price: string;
    number_of_fills: string;
    filled_value?: string;
    pending_cancel: boolean;
    size_in_quote: boolean;
    total_fees: string;
    size_inclusive_of_fees: boolean;
    total_value_after_fees: string;
    trigger_status: "UNKNOWN_TRIGGER_STATUS" | "INVALID_ORDER_TYPE" | "STOP_PENDING" | "STOP_TRIGGERED";
    order_type: "UNKNOWN_ORDER_TYPE" | "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT" | "BRACKET";
    reject_reason: "REJECT_REASON_UNSPECIFIED";
    settled: boolean;
    product_type: "SPOT" | "FUTURE";
    reject_message?: string;
    cancel_message?: string;
    order_placement_source: "RETAIL_SIMPLE" | "RETAIL_ADVANCED";
    outstanding_hold_amount: string;
    is_liquidation: boolean;
    last_fill_time: string;
    edit_history?: {
      price: string;
      size: string;
      replace_accept_timestamp: string;
      sequence: number;
    }[];
    sequence: number;
  }[];
  has_next: boolean;
  cursor: string;
}
