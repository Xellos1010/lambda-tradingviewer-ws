import { Account } from "coinbase-advanced-node-ts/dist/rest/types/accounts/Account";

// Helper function to calculate the buy size based on the currency account balance
export function calculateBuySize(currencyAccount: Account, percent?: number): number {
  if (!currencyAccount || !currencyAccount.available_balance || parseFloat(currencyAccount.available_balance.value) <= 0) {
    throw new Error("Currency account balance is invalid");
  }

  if (percent !== undefined) {
    // Validate percent value
    if (percent <= 0 || percent > 1) {
      throw new Error("Percent value must be greater than 0 and less than or equal to 1");
    }
  }

  const totalBalance = parseFloat(currencyAccount.available_balance.value);
  const buySize = percent ? totalBalance * percent : totalBalance;

  // Ensure sell size is not less than 0.0000001
  if (buySize < 0.0000001) {
    throw new Error("Buy size must be at least 0.0000001");
  }

  return buySize;
}

// Helper function to calculate the sell size based on the asset account balance
export function calculateSellSize(assetAccount: Account, percent?: number): number {
  if (!assetAccount || !assetAccount.available_balance || parseFloat(assetAccount.available_balance.value) <= 0) {
    throw new Error("Asset account balance is invalid");
  }

  if (percent !== undefined) {
    // Validate percent value
    if (percent <= 0 || percent > 1) {
      throw new Error("Percent value must be greater than 0 and less than or equal to 1");
    }
  }

  const totalBalance = parseFloat(assetAccount.available_balance.value);
  const sellSize = percent ? totalBalance * percent : totalBalance;

  // Ensure sell size is not less than 0.0000001
  if (sellSize < 0.0000001) {
    throw new Error("Sell size must be at least 0.0000001");
  }

  return sellSize;
}
