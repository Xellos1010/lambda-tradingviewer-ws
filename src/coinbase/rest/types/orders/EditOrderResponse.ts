
export interface EditOrderResponse {
  success: boolean;
  errors?: {
    edit_failure_reason?: string;
    preview_failure_reason?: string;
  }[];
}
