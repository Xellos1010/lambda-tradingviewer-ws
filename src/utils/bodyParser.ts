// src\utils\bodyParser.ts
import { Body } from '../data/model/recieving_data';

export const parseBody = (str: string): Body => {
  const result: any = {};
  let key = '';
  let value = '';
  let insideParentheses = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(') insideParentheses = true;
    if (char === ')') insideParentheses = false;

    if (char === ',' && !insideParentheses) {
      result[key.trim()] = value.trim();
      key = '';
      value = '';
    } else if (char === ':' && key === '') {
      key = value;
      value = '';
    } else {
      value += char;
    }
  }

  if (key !== '') {
    result[key.trim()] = value.trim();
  }

  return {
    strategy_name: result.strategy_name,
    strategy_params: result.strategy_params,
    order_action: result.order_action,
    contracts: result.contracts,
    ticker: result.ticker,
    position_size: result.position_size,
    // Add other expected properties here
  };
};
