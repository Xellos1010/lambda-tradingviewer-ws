import BaseApiSpotService from '../src/provider/BaseApiSpotService';
import axios from 'axios';
import { generateJWT } from '../src/coinbase/auth/generateJWT';

jest.mock('axios');
jest.mock('../src/coinbase/auth/generateJWT');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGenerateJWT = generateJWT as jest.MockedFunction<typeof generateJWT>;

describe('BaseApiSpotService', () => {
  let service: BaseApiSpotService;

  beforeEach(() => {
    service = new BaseApiSpotService('BTC-USD'); // Initialize the service here

    mockedGenerateJWT.mockReturnValue('mocked-jwt-token');
    mockedAxios.request.mockResolvedValue({ data: { price: '50000.00' } });
  });

  it('should get balance', async () => {
    const mockAccounts = [
      { currency: 'USD', balance: '1000', available_balance: '900' },
      { currency: 'BTC', balance: '5', available_balance: '4' },
    ];
    mockedAxios.request.mockResolvedValue({ data: mockAccounts });

    const balance = await service.getBalance('USD');
    expect(balance).toEqual({ total: 1000, available: 900, onOrder: 100 });
  });

  it('should get price', async () => {
    const price = await service.getPrice();
    expect(price).toEqual(50000);
  });

  it('should limit sell', async () => {
    mockedAxios.request.mockResolvedValue({ data: { id: 'order1' } });
    const result = await service.limitSell(0.5, 50000);
    expect(result).toEqual({ id: 'order1' });
  });

  it('should limit buy', async () => {
    mockedAxios.request.mockResolvedValue({ data: { id: 'order1' } });
    const result = await service.limitBuy(0.5, 50000);
    expect(result).toEqual({ id: 'order1' });
  });

  it('should market sell', async () => {
    mockedAxios.request.mockResolvedValue({ data: { id: 'order1' } });
    const result = await service.marketSell(0.5);
    expect(result).toEqual({ id: 'order1' });
  });

  it('should market buy', async () => {
    mockedAxios.request.mockResolvedValue({ data: { id: 'order1' } });
    const result = await service.marketBuy(0.5);
    expect(result).toEqual({ id: 'order1' });
  });

  it('should check status', async () => {
    mockedAxios.request.mockResolvedValue({ data: { status: 'done' } });
    const status = await service.checkStatus('order1');
    expect(status).toEqual('done');
  });

  it('should cancel order', async () => {
    mockedAxios.request.mockResolvedValue({ data: null });
    const result = await service.cancelOrder('order1');
    expect(result).toBeNull();
  });
});
