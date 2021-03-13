export interface TradeRouteTrade {
  operation: 'buy' | 'sell'
  comodity: string
  amount?: number
}

export interface TradeRouteStep {
  location: string
  trades: TradeRouteTrade[]
}

export interface TradeRoute {
  steps: TradeRouteStep[]
}
