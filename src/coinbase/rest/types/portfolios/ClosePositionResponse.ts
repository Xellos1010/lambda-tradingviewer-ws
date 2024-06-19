export interface ErrorResponse {
    error: string;
    message: string;
    error_details: string;
    preview_failure_reason: string;
    new_order_failure_reason: string;
  }
  
  export interface SuccessResponse {
    order_id: string;
    product_id: string;
    side: "BUY" | "SELL";
    client_order_id: string;
  }
  
  export interface ClosePositionResponse {
    success: boolean;
    success_response: SuccessResponse;
    error_response: ErrorResponse;
  }
  