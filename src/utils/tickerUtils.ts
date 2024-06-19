export const convertTickerToProductID = (ticker: string): string => {
    // Find the position of the first uppercase letter from the end of the string
    const splitPosition = ticker.search(/[A-Z]{3,4}$/);
    if (splitPosition === -1) {
      throw new Error(`Invalid ticker format: ${ticker}`);
    }
  
    return `${ticker.slice(0, splitPosition)}-${ticker.slice(splitPosition)}`;
  };