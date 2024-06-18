// src/coinbase/utils/apiUtils.ts
import axios from 'axios';
import { generateJWT } from '../auth/generateJWT';
import { config } from "../config";  // Adjust the import path as necessary
const { baseUrl} = config;

const getRequest = async (path: string) => {
  try {
    const token = generateJWT("GET", path);
    console.log("export JWT=" + token);
    console.log(
      `curl --ssl-no-revoke -H "Authorization: Bearer ${token}" https://${baseUrl}${path}`
    );
    const response = await axios.get(
      `https://${baseUrl}${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Fetched accounts data:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error calling Coinbase API:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return error;
  }
};

// const postRequest = async (path: string, data: object) => {
//   const token = generateJWT('POST', path);
//   console.log(`curl --ssl-no-revoke -H "Authorization: Bearer ${token}" https://api.coinbase.com/api/v3/brokerage${path}`);
//   const response = await apiClient.post(path, data, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

// Function for integrated testing
const getAccounts = async () => {
  const path = '/accounts';
  return await getRequest(path);
};

export { getRequest, getAccounts };
