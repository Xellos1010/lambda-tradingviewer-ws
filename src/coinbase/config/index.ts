// src/coinbase/config/index.ts
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();

export const loadConfig = (keyFilePath: string) => {
  const absoluteKeyFilePath = path.resolve(__dirname, keyFilePath);
  const keyFileContent = fs.readFileSync(absoluteKeyFilePath, 'utf8');
  const keyData = JSON.parse(keyFileContent);
  const baseUrl = "api.coinbase.com/api/v3/brokerage" as string;

  return {
    keyName: keyData.name,
    keySecret: keyData.privateKey,
    baseUrl: baseUrl,
  };
};
