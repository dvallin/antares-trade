export interface TradeRouteStep {
  location: string
  operation: 'buy' | 'sell'
  comodity: string
  amount?: number
}

export interface TradeRoute {
  currentStep: number
  steps: TradeRouteStep[]
}

export function getLastLocation(route: TradeRoute): string | undefined {
  return route.steps[route.steps.length - 1]?.location
}
