// src/coinbase/CoinbaseClient.ts
import BaseClient from "./BaseClient";
import OrdersClient from "./rest/OrdersClient";
import ProductsClient from "./rest/ProductsClient";
import AccountsClient from "./rest/AccountsClient";
import FeesClient from "./rest/FeesClient";
import ConvertsClient from "./rest/ConvertsClient";
import PaymentsClient from "./rest/PaymentsClient";
import PortfolioClient from "./rest/PortfolioClient";
import PublicClient from "./rest/PublicClient";
import Config from "./config/Config";
import { LazyProxyHandler } from "./LazyProxyHandler";

class CoinbaseClient extends BaseClient {
  public public?: PublicClient;
  public orders?: OrdersClient;
  public products?: ProductsClient;
  public accounts?: AccountsClient;
  public fees?: FeesClient;
  public converts?: ConvertsClient;
  public payments?: PaymentsClient;
  public portfolio?: PortfolioClient;

  constructor(config?: Config) {
    super(config);

    // Public endpoints
    this.public = new Proxy({}, new LazyProxyHandler(() => new PublicClient(this.config), false));

    // Authenticated endpoints
    if (this.config) {
      this.orders = new Proxy({}, new LazyProxyHandler(() => new OrdersClient(this.config), true, this.config));
      this.products = new Proxy({}, new LazyProxyHandler(() => new ProductsClient(this.config), true, this.config));
      this.accounts = new Proxy({}, new LazyProxyHandler(() => new AccountsClient(this.config), true, this.config));
      this.fees = new Proxy({}, new LazyProxyHandler(() => new FeesClient(this.config), true, this.config));
      this.converts = new Proxy({}, new LazyProxyHandler(() => new ConvertsClient(this.config), true, this.config));
      this.payments = new Proxy({}, new LazyProxyHandler(() => new PaymentsClient(this.config), true, this.config));
      this.portfolio = new Proxy({}, new LazyProxyHandler(() => new PortfolioClient(this.config), true, this.config));
    }
  }
}

export default CoinbaseClient;
