export const API_ENV_KEY = "COINBASE_API_KEY";
export const API_SECRET_ENV_KEY = "COINBASE_API_SECRET";
export const USER_AGENT = `coinbase-advanced-ts/${require('./version').version}`;

// REST Constants
export const BASE_URL = "api.coinbase.com";
export const API_PREFIX = "/api/v3/brokerage";
export const REST_SERVICE = "retail_rest_api_proxy";

// Websocket Constants
export const WS_BASE_URL = "wss://advanced-trade-ws.coinbase.com";
export const WS_SERVICE = "public_websocket_api";

export const WS_RETRY_MAX = 5;
export const WS_RETRY_BASE = 5;
export const WS_RETRY_FACTOR = 1.5;

// Message Types
export const SUBSCRIBE_MESSAGE_TYPE = "subscribe";
export const UNSUBSCRIBE_MESSAGE_TYPE = "unsubscribe";

// Channels
export const HEARTBEATS = "heartbeats";
export const CANDLES = "candles";
export const MARKET_TRADES = "market_trades";
export const STATUS = "status";
export const TICKER = "ticker";
export const TICKER_BATCH = "ticker_batch";
export const LEVEL2 = "level2";
export const USER = "user";

export const WS_AUTH_CHANNELS = new Set([USER]);

export const constants = {
    BASE_URL: 'https://api.coinbase.com',
    API_PREFIX: '/api/v3/brokerage',
  };
  