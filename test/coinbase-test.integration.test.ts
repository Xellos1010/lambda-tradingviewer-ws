// test/apiUtils.integration.test.ts
import { fetchAccounts } from '../src/coinbase-test';

describe('Coinbase API Integration Test', () => {
  it('should fetch accounts', async () => {
    try {
      const data = await fetchAccounts();
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
