import { listAccounts, getAccount } from '../src/coinbase/rest/accounts';

describe('Coinbase API Integration Test - Accounts', () => {
  it('should fetch accounts and then fetch an account by UUID', async () => {
    try {
      // Fetch accounts
      const accountsData = await listAccounts();
      console.log('Fetched accounts data:', accountsData);

      // Get the UUID of the first account
      const accountUUID = accountsData.accounts[0].uuid;

      // Fetch account by UUID
      const accountData = await getAccount(accountUUID);
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
