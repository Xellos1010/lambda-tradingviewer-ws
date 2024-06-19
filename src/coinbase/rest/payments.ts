import { getRequest } from "./utils/apiUtils";

const listPaymentMethods = async () => {
    return await getRequest(`/payment_methods`);
  };

  export {
    listPaymentMethods,
  };
  