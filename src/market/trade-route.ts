export interface TradeRouteTrade {
  operation: 'buy' | 'sell'
  amount: 'all' | number
  comodity: string
}

export interface TradeRouteStep {
  location: string
  trades: TradeRouteTrade[]
}

export interface TradeRoute {
  steps: TradeRouteStep[]
}
