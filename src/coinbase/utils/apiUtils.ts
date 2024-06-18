// src/coinbase/utils/apiUtils.ts
import axios from "axios";
import { generateJWT } from "../auth/generateJWT";
import { config } from "../config"; // Adjust the import path as necessary
const { baseUrl } = config;

const executeRequest = async (method: string, path: string, data?: object) => {
  try {
    const token = generateJWT(method, path);
    console.log("export JWT=" + token);
    console.log(
      `curl --ssl-no-revoke -H "Authorization: Bearer ${token}" https://${baseUrl}${path}`
    );

    let response;
    if (method === "GET") {
      response = await axios.get(`https://${baseUrl}${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } else if (method === "POST") {
      response = await axios.post(`https://${baseUrl}${path}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    console.log(`Fetched ${method} data:`, response?.data);
    return response?.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error calling Coinbase API:`, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // re-throw the error after logging it
  }
};

const getRequest = async (path: string) => {
  return await executeRequest("GET", path);
};

const postRequest = async (path: string, data: object) => {
  return await executeRequest("POST", path, data);
};

// Function for integrated testing
const getAccounts = async () => {
  const path = "/accounts";
  return await getRequest(path);
};

export { getRequest, postRequest, getAccounts };
