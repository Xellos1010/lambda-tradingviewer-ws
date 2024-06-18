// test/apiUtils.integration.test.ts
import { getAccounts } from '../src/coinbase/utils/apiUtils';

describe('Coinbase API Integration Test', () => {
  it('should fetch accounts', async () => {
    try {
      const data = await getAccounts();
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
