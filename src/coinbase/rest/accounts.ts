import { getRequest } from "./utils/apiUtils";
// Function for integrated testing
const listAccounts = async () => {
    const path = "/accounts";
    return await getRequest(path);
  };
  
  // Specific API methods
  const getAccount = async (accountUUID: string) => {
    return await getRequest(`/accounts/${accountUUID}`);
  };
  
  export {
    getAccount,
    listAccounts
  };
  