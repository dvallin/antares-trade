import { Mutation, State, Storage } from '../state'
import { getScaledProduction, Production } from './production'
import { Rates } from './rates'
import { TradeRoute } from './trade-route'

export interface Market {
  production: Production[]
  rates: Rates
}

export interface MarketState {
  markets: Storage<Market>
  balances: Storage<number>
  routes: Storage<TradeRoute>
  lastUpdate: number
}

export const market: MarketState = {
  markets: {},
  balances: { player: 100000, ai: 200000000 },
  routes: {},
  lastUpdate: Date.now(),
}

export function getDemandPerHour(state: State, location: string, comodity: string): number {
  const production = state.market.markets[location]?.production || []
  return production.map((p) => p.consumes[comodity] || 0).reduce((a, b) => a + b, 0)
}

export function getProductionPerHour(state: State, location: string, comodity: string): number {
  const production = state.market.markets[location]?.production || []
  return production
    .map((p) => getScaledProduction(state, location, p))
    .map((p) => p.produces[comodity] || 0)
    .reduce((a, b) => a + b, 0)
}

export function isTradingLocation(state: State, location: string): boolean {
  return state.market.markets[location]?.rates !== undefined
}

export const initTradeRouting = (id: string): Mutation<State> => (s) => {
  s.market.routes[id] = { currentStep: 0, steps: [] }
}

export const setMarket = (id: string, market?: Market): Mutation<State> => (s) => {
  if (market) {
    s.market.markets[id] = market
  } else {
    delete s.market.markets[id]
  }
}

export const setTradeRoute = (id: string, tradeRoute?: TradeRoute): Mutation<State> => (s) => {
  if (tradeRoute) {
    s.market.routes[id] = tradeRoute
  } else {
    delete s.market.routes[id]
  }
}
