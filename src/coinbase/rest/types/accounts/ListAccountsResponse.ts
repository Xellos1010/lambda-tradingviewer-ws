import { Account } from "./Account";


export interface ListAccountsResponse {
  accounts: Account[];
  has_next: boolean;
  cursor: string;
  size: number;
}
