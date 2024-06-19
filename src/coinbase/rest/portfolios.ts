import { getRequest } from "./utils/apiUtils";

const listPortfolios = async (queryParams: object = {}) => {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await getRequest(`/portfolios?${queryString}`);
  };
  
  const getPortfolioBreakdown = async (portfolioUUID: string, queryParams: object = {}) => {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await getRequest(`/portfolios/${portfolioUUID}?${queryString}`);
  };
  
  const getFuturesBalanceSummary = async () => {
    return await getRequest(`/cfm/balance_summary`);
  };
  
  const listFuturesPositions = async () => {
    return await getRequest(`/cfm/positions`);
  };
  
  const getFuturesPosition = async (productID: string) => {
    return await getRequest(`/cfm/positions/${productID}`);
  };
  
  const listFuturesSweeps = async () => {
    return await getRequest(`/cfm/sweeps`);
  };
  
  const getIntradayMarginSetting = async () => {
    return await getRequest(`/cfm/intraday/margin_setting`);
  };
  
  const getCurrentMarginWindow = async () => {
    return await getRequest(`/cfm/intraday/current_margin_window`);
  };
  
  const getPerpetualsPortfolioSummary = async (portfolioUUID: string) => {
    return await getRequest(`/intx/portfolio/${portfolioUUID}`);
  };
  
  const listPerpetualsPositions = async (portfolioUUID: string) => {
    return await getRequest(`/intx/positions/${portfolioUUID}`);
  };
  
  const getPerpetualsPosition = async (portfolioUUID: string, symbol: string) => {
    return await getRequest(`/intx/positions/${portfolioUUID}/${symbol}`);
  };
  
  const getPortfolioBalances = async (portfolioUUID: string) => {
    return await getRequest(`/intx/balances/${portfolioUUID}`);
  };

  export {
    listPortfolios,
    getPortfolioBreakdown,
    getFuturesBalanceSummary,
    listFuturesPositions,
    getFuturesPosition,
    listFuturesSweeps,
    getIntradayMarginSetting,
    getCurrentMarginWindow,
    getPerpetualsPortfolioSummary,
    listPerpetualsPositions,
    getPerpetualsPosition,
    getPortfolioBalances,
  };
  