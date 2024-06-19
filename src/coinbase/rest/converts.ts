// src/coinbase/rest/converts.ts
import BaseClient from "../BaseClient";

class ConvertsClient extends BaseClient {
  async getConvertTrade(tradeID: string, queryParams: object = {}): Promise<any> {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await this.getRequest(`/convert/trade/${tradeID}`, queryString);
  }
}

export default ConvertsClient;
