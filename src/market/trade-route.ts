export interface TradeRouteStep {
  location: string
  operation: 'buy' | 'sell'
  comodity: string
  amount?: number
}

export interface TradeRoute {
  steps: TradeRouteStep[]
}
