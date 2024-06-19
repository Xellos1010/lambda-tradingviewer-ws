// test/apiUtils.integration.test.ts
import { listAccounts } from '../src/coinbase/rest/accounts';

describe('Coinbase API Integration Test', () => {
  it('should fetch accounts', async () => {
    try {
      const data = await listAccounts();
      console.log('Fetched accounts data:', data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error calling Coinbase API:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  });
});
