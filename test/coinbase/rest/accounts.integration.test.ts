import CoinbaseClient from "../../../src/coinbase/CoinbaseClient";
import config from "../../../src/config";
import Config from "../../../src/coinbase/config/Config";

describe('Coinbase API Integration Test - Accounts', () => {
  it('should fetch accounts and then fetch an account by UUID', async () => {
    try {
      const client = new CoinbaseClient(
        Config.getInstance(
          config.coinbase.keys[0].name,
          config.coinbase.keys[0].privateKey,
          config.coinbase.baseUrl
        )
      );

      // Fetch accounts
      const accountsData = await client.accounts?.listAccounts();
      console.log('Fetched accounts data:', JSON.stringify(accountsData, null, 2));

      if (!accountsData?.accounts || accountsData.accounts.length === 0) {
        throw new Error("No accounts found");
      }

      // Get the UUID of the first account
      const accountUUID = accountsData.accounts[0].uuid;

      // Fetch account by UUID
      const accountData = await client.accounts?.getAccount(accountUUID);
      console.log('Fetched account data:', accountData);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error calling Coinbase API:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  });
});
