import { AvailableBalance } from "./AvailableBalance";
import { Hold } from "./Hold";

  export interface Account {
    uuid: string;
    name: string;
    currency: string;
    available_balance: AvailableBalance;
    default: boolean;
    active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    type: "ACCOUNT_TYPE_CRYPTO" | "ACCOUNT_TYPE_FIAT" | "ACCOUNT_TYPE_VAULT";
    ready: boolean;
    hold: Hold;
    retail_portfolio_id: string;
  }
  
