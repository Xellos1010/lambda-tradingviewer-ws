export interface MarginWindow {
    margin_window_type: "UNSPECIFIED" | "OVERNIGHT" | "WEEKEND" | "INTRADAY" | "TRANSITION";
    end_time: string;
    is_intraday_margin_killswitch_enabled: boolean;
    is_intraday_margin_enrollment_killswitch_enabled: boolean;
  }
  
  export interface GetCurrentMarginWindowResponse {
    margin_window: MarginWindow;
  }
  