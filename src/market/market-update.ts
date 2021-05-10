import { Draft } from 'immer'
import { Mutation, State } from '../state'
import { applyProductionUpdate, calculateProductionUpdate, Production } from './production'

export type MarketUpdate = {
  id: string
  production: Production
}
export function collectUpdates(state: State, dt: number): MarketUpdate[] {
  const updates: MarketUpdate[] = []
  Object.entries(state.market.markets).forEach(([id, market]) => {
    Object.values(market.production).forEach((p) => {
      const production = calculateProductionUpdate(state, dt, id, p)
      if (production) {
        updates.push({ id, production })
      }
    })
  })
  return updates
}
export function applyMarketUpdate(state: Draft<State>, update: MarketUpdate): void {
  applyProductionUpdate(state, update.id, update.production)
}

export const updateMarkets = (dt: number): Mutation<State> => (state) => {
  collectUpdates(state, dt).forEach((update) => applyMarketUpdate(state, update))
  state.market.lastUpdate += dt
}
