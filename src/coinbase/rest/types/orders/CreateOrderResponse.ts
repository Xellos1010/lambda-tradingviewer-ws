
export interface CreateOrderResponse {
  success: boolean;
  failure_reason?: string;
  order_id: string;
  success_response?: {
    order_id: string;
    product_id: string;
    side: "BUY" | "SELL";
    client_order_id: string;
  };
  error_response?: {
    error: string;
    message: string;
    error_details: string;
  };
  preview_failure_reason?: string;
  new_order_failure_reason?: string;
}
