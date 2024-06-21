// src/config/index.ts
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Function to read key file
const readKeyFile = (filePath: string) => {
  const keyFilePath = path.resolve(__dirname, filePath);
  const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
  return JSON.parse(keyFileContent);
};

// Function to read all key files in the keys directory
const readAllKeyFiles = () => {
  const keysDir = path.resolve(__dirname, '../keys');
  const keyFiles = fs.readdirSync(keysDir).filter(file => file.endsWith('.json'));
  return keyFiles.map(file => readKeyFile(path.join(keysDir, file)));
};

// Read all key files for Coinbase API
const coinbaseKeys = readAllKeyFiles();

export default {
  tables: {
    hold: process.env.DYNAMODB_HOLD_TABLE as string,
    setting: process.env.DYNAMODB_SETTING_TABLE as string,
    strategy: process.env.DYNAMODB_STRATEGY_TABLE as string,
  },
  strategy: {
    type: 'most',
    asset: 'BTC',
    currency: 'USD',
    defaultSetting: { isReuseHold: true, riskPercent: 0.05, minAmountUSD: 11 }
  },
  user: {
    email: 'e.mccallvr@gmail.com'
  },
  cognito: {
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    clientId: process.env.AWS_COGNITO_APP_CLIENT_ID,
    region: process.env.AWS_COGNITO_REGION,
  },
  coinbase: {
    baseUrl: "api.coinbase.com/api/v3/brokerage" as string,
    keys: coinbaseKeys
  }
};
