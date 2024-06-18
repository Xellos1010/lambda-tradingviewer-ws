// src/coinbase/config/index.ts
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();

const keyFilePath = path.resolve(__dirname, '../keys/evan_cdp_api_key.json');
const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
const keyData = JSON.parse(keyFileContent);
const baseUrl = process.env.COINBASE_API_BASE_URL as string;
console.log('Key Data:', keyData); // Add this line to verify the key data
console.log('baseUrl:', baseUrl); // Add this line to verify the key data

export const config = {
  keyName: keyData.name,
  keySecret: keyData.privateKey,
  baseUrl: baseUrl,
};
