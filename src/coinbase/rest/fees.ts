// src/coinbase/rest/fees.ts
import BaseClient from "../BaseClient";

class FeesClient extends BaseClient {
  async getTransactionsSummary(queryParams: object = {}): Promise<any> {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await this.getRequest(`/transaction_summary`, queryString);
  }
}

export default FeesClient;
