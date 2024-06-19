import { getRequest } from "./utils/apiUtils";

const getConvertTrade = async (tradeID: string, queryParams: object = {}) => {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await getRequest(`/convert/trade/${tradeID}?${queryString}`);
  };
  
  
  export {
    getConvertTrade,
  };
  