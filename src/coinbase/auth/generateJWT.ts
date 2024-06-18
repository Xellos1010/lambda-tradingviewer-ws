import { config } from "../config";  // Adjust the import path as necessary
import { sign } from "jsonwebtoken";
import * as crypto from "crypto";

const { keyName, keySecret, baseUrl} = config;

const generateJWT = (requestMethod : string, requestPath : string): string => {
  const algorithm = "ES256";
  const uri = `${requestMethod} ${baseUrl}${requestPath}`;
  console.log("uri: " + uri);
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

export { generateJWT };