// src/coinbase/coinbaseClient.ts
import BaseClient from './BaseClient';
import OrdersClient from './rest/orders';
import ProductsClient from './rest/products';
import AccountsClient from './rest/accounts';
import FeesClient from './rest/fees';
import ConvertsClient from './rest/converts';
import PaymentsClient from './rest/payments';
import PortfolioClient from './rest/portfolios';
import Config from './config/Config';

class CoinbaseClient extends BaseClient {
  private ordersClient?: OrdersClient;
  private productsClient?: ProductsClient;
  private accountsClient?: AccountsClient;
  private feesClient?: FeesClient;
  private convertsClient?: ConvertsClient;
  private paymentsClient?: PaymentsClient;
  private portfolioClient?: PortfolioClient;

  constructor(config: Config) {
    super(config);
  }

  private getOrdersClient(): OrdersClient {
    if (!this.ordersClient) {
      this.ordersClient = new OrdersClient(this.config);
    }
    return this.ordersClient;
  }

  private getProductsClient(): ProductsClient {
    if (!this.productsClient) {
      this.productsClient = new ProductsClient(this.config);
    }
    return this.productsClient;
  }

  private getAccountsClient(): AccountsClient {
    if (!this.accountsClient) {
      this.accountsClient = new AccountsClient(this.config);
    }
    return this.accountsClient;
  }

  private getFeesClient(): FeesClient {
    if (!this.feesClient) {
      this.feesClient = new FeesClient(this.config);
    }
    return this.feesClient;
  }

  private getConvertsClient(): ConvertsClient {
    if (!this.convertsClient) {
      this.convertsClient = new ConvertsClient(this.config);
    }
    return this.convertsClient;
  }

  private getPaymentsClient(): PaymentsClient {
    if (!this.paymentsClient) {
      this.paymentsClient = new PaymentsClient(this.config);
    }
    return this.paymentsClient;
  }

  private getPortfolioClient(): PortfolioClient {
    if (!this.portfolioClient) {
      this.portfolioClient = new PortfolioClient(this.config);
    }
    return this.portfolioClient;
  }

  // Orders API
  async createSellOrder(productID: string, baseSize: string, clientOrderID: string, orderConfig: { limit_price: string; end_time: string; post_only?: boolean }) {
    return await this.getOrdersClient().createSellOrder(productID, baseSize, clientOrderID, orderConfig);
  }

  async createBuyOrder(productID: string, baseSize: string, clientOrderID: string, orderConfig: { limit_price: string; end_time: string; post_only?: boolean }) {
    return await this.getOrdersClient().createBuyOrder(productID, baseSize, clientOrderID, orderConfig);
  }

  async generateClientOrderID() {
    return await this.getOrdersClient().generateClientOrderID();
  }

  async cancelOrders(orderIDs: string[]) {
    return await this.getOrdersClient().cancelOrders(orderIDs);
  }

  async getOrder(orderID: string) {
    return await this.getOrdersClient().getOrder(orderID);
  }

  // Products API
  async getBestBidAsk(productIDs?: string[]) {
    return await this.getProductsClient().getBestBidAsk(productIDs);
  }

  async listProducts() {
    return await this.getProductsClient().listProducts();
  }

  async getProduct(productID: string) {
    return await this.getProductsClient().getProduct(productID);
  }

  async getProductBook(queryParams: object = {}) {
    return await this.getProductsClient().getProductBook(queryParams);
  }

  async getMarketTrades(productID: string, queryParams: object = {}) {
    return await this.getProductsClient().getMarketTrades(productID, queryParams);
  }

  // Accounts API
  async listAccounts() {
    return await this.getAccountsClient().listAccounts();
  }

  async getAccount(accountUUID: string) {
    return await this.getAccountsClient().getAccount(accountUUID);
  }

  // Fees API
  async getTransactionsSummary(queryParams: object = {}) {
    return await this.getFeesClient().getTransactionsSummary(queryParams);
  }

  // Converts API
  async getConvertTrade(tradeID: string, queryParams: object = {}) {
    return await this.getConvertsClient().getConvertTrade(tradeID, queryParams);
  }

  // Payments API
  async listPaymentMethods() {
    return await this.getPaymentsClient().listPaymentMethods();
  }

  // Portfolio API
  async listPortfolios(queryParams: object = {}) {
    return await this.getPortfolioClient().listPortfolios(queryParams);
  }

  async getPortfolioBreakdown(portfolioUUID: string, queryParams: object = {}) {
    return await this.getPortfolioClient().getPortfolioBreakdown(portfolioUUID, queryParams);
  }

  async getFuturesBalanceSummary() {
    return await this.getPortfolioClient().getFuturesBalanceSummary();
  }

  async listFuturesPositions() {
    return await this.getPortfolioClient().listFuturesPositions();
  }

  async getFuturesPosition(productID: string) {
    return await this.getPortfolioClient().getFuturesPosition(productID);
  }

  async listFuturesSweeps() {
    return await this.getPortfolioClient().listFuturesSweeps();
  }

  async getIntradayMarginSetting() {
    return await this.getPortfolioClient().getIntradayMarginSetting();
  }

  async getCurrentMarginWindow() {
    return await this.getPortfolioClient().getCurrentMarginWindow();
  }

  async getPerpetualsPortfolioSummary(portfolioUUID: string) {
    return await this.getPortfolioClient().getPerpetualsPortfolioSummary(portfolioUUID);
  }

  async listPerpetualsPositions(portfolioUUID: string) {
    return await this.getPortfolioClient().listPerpetualsPositions(portfolioUUID);
  }

  async getPerpetualsPosition(portfolioUUID: string, symbol: string) {
    return await this.getPortfolioClient().getPerpetualsPosition(portfolioUUID, symbol);
  }

  async getPortfolioBalances(portfolioUUID: string) {
    return await this.getPortfolioClient().getPortfolioBalances(portfolioUUID);
  }
}

export default CoinbaseClient;
