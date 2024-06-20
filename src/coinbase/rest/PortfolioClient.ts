// src/coinbase/rest/portfolios.ts
import BaseClient from "../BaseClient";

class PortfolioClient extends BaseClient {
  async listPortfolios(queryParams: object = {}): Promise<any> {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await this.getRequest(`/portfolios`, queryString);
  }

  async getPortfolioBreakdown(portfolioUUID: string, queryParams: object = {}): Promise<any> {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await this.getRequest(`/portfolios/${portfolioUUID}`, queryString);
  }

  async getFuturesBalanceSummary(): Promise<any> {
    return await this.getRequest(`/cfm/balance_summary`);
  }

  async listFuturesPositions(): Promise<any> {
    return await this.getRequest(`/cfm/positions`);
  }

  async getFuturesPosition(productID: string): Promise<any> {
    return await this.getRequest(`/cfm/positions/${productID}`);
  }

  async listFuturesSweeps(): Promise<any> {
    return await this.getRequest(`/cfm/sweeps`);
  }

  async getIntradayMarginSetting(): Promise<any> {
    return await this.getRequest(`/cfm/intraday/margin_setting`);
  }

  async getCurrentMarginWindow(): Promise<any> {
    return await this.getRequest(`/cfm/intraday/current_margin_window`);
  }

  async getPerpetualsPortfolioSummary(portfolioUUID: string): Promise<any> {
    return await this.getRequest(`/intx/portfolio/${portfolioUUID}`);
  }

  async listPerpetualsPositions(portfolioUUID: string): Promise<any> {
    return await this.getRequest(`/intx/positions/${portfolioUUID}`);
  }

  async getPerpetualsPosition(portfolioUUID: string, symbol: string): Promise<any> {
    return await this.getRequest(`/intx/positions/${portfolioUUID}/${symbol}`);
  }

  async getPortfolioBalances(portfolioUUID: string): Promise<any> {
    return await this.getRequest(`/intx/balances/${portfolioUUID}`);
  }
}

export default PortfolioClient;
