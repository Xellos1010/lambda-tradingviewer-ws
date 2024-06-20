import { Account } from '../coinbase/rest/types/accounts/Account';

// Helper function to calculate the buy size based on the currency account balance
export function calculateBuySize(currencyAccount: Account): number {
  if (!currencyAccount || !currencyAccount.available_balance || parseFloat(currencyAccount.available_balance.value) <= 0) {
    throw new Error("Currency account balance is invalid");
  }

  return parseFloat(currencyAccount.available_balance.value);
}

// Helper function to calculate the sell size based on the asset account balance
export function calculateSellSize(assetAccount: Account): number {
  if (!assetAccount || !assetAccount.available_balance || parseFloat(assetAccount.available_balance.value) <= 0) {
    throw new Error("Asset account balance is invalid");
  }

  return parseFloat(assetAccount.available_balance.value);
}
