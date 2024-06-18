export {};

declare global {
    type TOrder = {
        avgPrice?: string | number
        price?: string | number
        stopPrice?: string | number
        status?: string
        totalQty?: string | number
        origQty?: string | number
    }
    type TFill = {
        commissionAsset?: string
        commission?: string
        price?: string | number
        qty?: string | number
    }
    type  THold = {
        id?: string
        type: string
        symbol: string
        status?: string
        data?: any
        avgPrice?: number
        avgPriceProfit?: number
        orderId?: string
        user?: string
        qty?: number
        createdAt?: string | number
    }
    type TSetting = {
        id?: string
        type: string
        symbol: string
        status?: string
        user?: string
        data: { isReuseHold: boolean, riskPercent: number, minAmountUSD: number }
        createdAt?: string | number
    }
    type TStrategy = {
        id?: string
        type: string
        symbol: string
        status?: string
        profit?: number
        user?: string
        data?: {
            buyOrder?: TOrder,
            sellOrder?: TOrder,
            fromStrategyId?: string
        }
        createdAt?: string | number
        holdId?: string
        unHoldPrice?: number
    }
}