import axios, { AxiosRequestConfig, Method, AxiosResponse } from "axios";
// import axios from "axios";
import { generateJWT } from "../../auth/generateJWT";
import { config } from "../../config"; // Adjust the import path as necessary
const { baseUrl } = config;
// import {} from "../../config/constants" //TODO: Setup Constants that define exponential backoff logic for REST request

// Helper function for exponential backoff
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle exceptions
const handleException = (response: AxiosResponse) => {
  if (response.status >= 400) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }
};

// Method to send requests with exponential backoff
const sendRequest = async (
  httpMethod: Method,
  urlPath: string,
  params: object = {},
  headers: object = {},
  data: object = {},
  retries = 3
): Promise<any> => {
  const url = `https://${baseUrl}${urlPath}`;
  const initialBackoff = 1000; // Initial backoff time in milliseconds
  let attempts = 0;

  while (attempts < retries) {
    try {
      const config: AxiosRequestConfig = {
        method: httpMethod,
        url,
        params,
        headers,
        data,
        timeout: 10000, // You can set a timeout as needed
      };

      console.debug(`Sending ${httpMethod} request to ${url}`);

      const response = await axios(config);
      handleException(response); // Raise an HTTPError for bad responses

      console.debug(`Raw response:`, response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        attempts++;
        const backoffTime = initialBackoff * Math.pow(2, attempts);
        console.error(`Rate limited. Retrying in ${backoffTime / 1000} seconds...`);
        await sleep(backoffTime);
      } else {
        if (error instanceof Error) {
          console.error(`Error calling Coinbase API:`, error.message);
        } else {
          console.error(`Unexpected error:`, error);
        }
        throw error;
      }
    }
  }
  throw new Error("Max retries exceeded");
};

// Execute request with JWT
const executeRequest = async (method: Method, path: string, queryString?: string, data?: object, retries = 3): Promise<any> => {
  const token = generateJWT(method, path);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  return sendRequest(method, path + (queryString ? `?${queryString}` : ''), {}, headers, data, retries);
};

const getRequest = async (path: string, queryString? : string) => {
  return await executeRequest("GET", path, queryString);
};

const postRequest = async (path: string, data: object, queryString? : string) => {
  return await executeRequest("POST", path, queryString, data);
};

export {
  getRequest,
  postRequest,
};
