import { Body } from '../data/schemas/recieving_data';

export const parseBody = (str: string): Body => {
  // First, parse the JSON string to remove extra quotes
  const parsedJson = JSON.parse(str);

  // Now, we need to remove the extra quotes from the keys and values
  const cleanedJson: { [key: string]: string } = {};
  for (const key in parsedJson) {
    if (parsedJson.hasOwnProperty(key)) {
      const cleanedKey = key.replace(/^"|"$/g, '');
      const cleanedValue = parsedJson[key].replace(/^"|"$/g, '');
      cleanedJson[cleanedKey] = cleanedValue;
    }
  }

  // Ensure all required properties are present
  if (!cleanedJson.strategy_name || !cleanedJson.strategy_params || !cleanedJson.order_action || !cleanedJson.contracts || !cleanedJson.ticker || !cleanedJson.position_size) {
    throw new Error('Missing required properties in the parsed body');
  }

  return {
    strategy_name: cleanedJson.strategy_name,
    strategy_params: cleanedJson.strategy_params,
    order_action: cleanedJson.order_action,
    contracts: cleanedJson.contracts,
    ticker: cleanedJson.ticker,
    position_size: cleanedJson.position_size,
  };
};