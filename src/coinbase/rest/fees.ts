import { getRequest } from "./utils/apiUtils";

const getTransactionsSummary = async (queryParams: object = {}) => {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await getRequest(`/transaction_summary?${queryString}`);
  };
  
  export {
    getTransactionsSummary,
  };
  