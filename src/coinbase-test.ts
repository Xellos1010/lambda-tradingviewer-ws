// script.ts
import { sign } from "jsonwebtoken";
import * as crypto from "crypto";
import axios from "axios";
import { config } from "./coinbase/config";  // Adjust the import path as necessary

const { keyName, keySecret, baseUrl} = config;

const requestMethod = "GET";
const requestPath = "/accounts";

const algorithm = "ES256";
const uri = `${requestMethod} ${baseUrl}${requestPath}`;
console.log("uri: " + uri);
const generateJWT = (): string => {
  const payload = {
    iss: "cdp",
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 120,
    sub: keyName,
    uri,
  };

  const header = {
    alg: algorithm,
    kid: keyName,
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  return sign(payload, keySecret, { algorithm, header });;
};

// Axios request to the Coinbase API
const fetchAccounts = async () => {
  try {
    const token = generateJWT();
    console.log("export JWT=" + token);
    console.log(
      `curl --ssl-no-revoke -H "Authorization: Bearer ${token}" https://${baseUrl}${requestPath}`
    );
    const response = await axios.get(
      `https://${baseUrl}${requestPath}`,
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
  }
};

fetchAccounts();

export { generateJWT, fetchAccounts };
