// src/coinbase/rest/payments.ts
import BaseClient from "../BaseClient";

class PaymentsClient extends BaseClient {
  async listPaymentMethods(): Promise<any> {
    return await this.getRequest(`/payment_methods`);
  }
}

export default PaymentsClient;
