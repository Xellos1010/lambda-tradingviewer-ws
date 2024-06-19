// src/coinbase/BaseClient.ts
import { sign } from "jsonwebtoken";
import * as crypto from "crypto";
import axios, { AxiosRequestConfig, Method, AxiosResponse } from "axios";
import Config from "./config/Config";

class BaseClient {
  protected config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  protected generateJWT(requestMethod: string, requestPath: string): string {
    const algorithm = "ES256";
    const uri = this.formatJWTUri(requestMethod, requestPath);
    const payload = {
      iss: "cdp",
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120,
      sub: this.config.getKeyName(),
      uri,
    };

    const header = {
      alg: algorithm,
      kid: this.config.getKeyName(),
      nonce: crypto.randomBytes(16).toString("hex"),
    };

    return sign(payload, this.config.getKeySecret(), { algorithm, header });
  }

  protected formatJWTUri(method: string, path: string): string {
    return `${method} ${this.config.getBaseUrl()}${path}`;
  }

  protected async sendRequest(
    httpMethod: Method,
    urlPath: string,
    params: object = {},
    headers: object = {},
    data: object = {},
    retries = 3
  ): Promise<any> {
    const url = `https://${this.config.getBaseUrl()}${urlPath}`;
    const initialBackoff = 1000;
    let attempts = 0;

    while (attempts < retries) {
      try {
        const config: AxiosRequestConfig = {
          method: httpMethod,
          url,
          params,
          headers,
          data,
          timeout: 10000,
        };

        const response = await axios(config);
        this.handleException(response);

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          attempts++;
          const backoffTime = initialBackoff * Math.pow(2, attempts);
          await this.sleep(backoffTime);
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retries exceeded");
  }

  protected async executeRequest(
    method: Method,
    path: string,
    queryString?: string,
    data?: object,
    retries = 3
  ): Promise<any> {
    const token = this.generateJWT(method, path);
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    return this.sendRequest(method, path + (queryString ? `?${queryString}` : ''), {}, headers, data, retries);
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleException(response: AxiosResponse) {
    if (response.status >= 400) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
  }

  protected async getRequest(path: string, queryString?: string) {
    return await this.executeRequest("GET", path, queryString);
  }

  protected async postRequest(path: string, data: object, queryString?: string) {
    return await this.executeRequest("POST", path, queryString, data);
  }
}

export default BaseClient;
