// test/apiUtils.test.ts
import { getRequest } from '../src/coinbase/utils/apiUtils';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('Coinbase API Utils', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterAll(() => {
    mock.restore();
  });

  it('should get a list of accounts', async () => {
    const mockResponse = {
      accounts: [
        {
          uuid: 'f603f97c-37d7-4e58-b264-c27e9e393dd9',
          name: 'USD Wallet',
          currency: 'USD',
          available_balance: {
            value: '1000.00',
            currency: 'USD',
          },
          default: true,
          active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z',
          type: 'ACCOUNT_TYPE_FIAT',
          ready: true,
        },
      ],
      has_next: false,
      cursor: '',
      size: 1,
    };

    mock.onGet('https://api.coinbase.com/api/v3/brokerage/accounts').reply(200, mockResponse);

    const data = await getRequest('/accounts');
    expect(data).toEqual(mockResponse);
  });
});
