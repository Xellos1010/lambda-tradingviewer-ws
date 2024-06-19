export interface MonetaryAmount {
    value: string;
    currency: string;
  }
  
  export interface Sweep {
    id: string;
    requested_amount: MonetaryAmount;
    should_sweep_all: boolean;
    status: "UNKNOWN_FCM_SWEEP_STATUS" | "PENDING" | "PROCESSING";
    scheduled_time: string;
  }
  
  export interface ListFuturesSweepsResponse {
    sweeps: Sweep[];
  }
  