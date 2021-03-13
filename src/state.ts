import { Draft } from 'immer'

import { StarSystemState, updateStarSystems } from './star-system/state'
import { MapState, updateMap } from './map/state'
import { NameState } from './meta-data/state'
import { BodyState } from './body/state'
import { ShipsState } from './ships/state'
import { DynamicsState } from './dynamics/state'
import { MarketState, setRoute, updateMarkets } from './market/state'
import { initDynamics, updateDynamics } from './dynamics/mutations'
import { loadObjectIntoDraft, saveObject } from './local-storage'

export const updateInterval = 30
// update a maximum of 1 minutes at a time
// so being offline makes you lose not more than a minute in an automation step
export const updateMaximumDt = 60 * 1000
export const saveInterval = 1000

export type Mutation<State> = (draft: Draft<State>) => void
export type Mutate<State> = (mutation: Mutation<State>) => void

export function chain(...mutations: Mutation<State>[]): Mutation<State> {
  return (d) => {
    mutations.forEach((m) => m(d))
  }
}

export interface Storage<C> {
  [entity: string]: C
}
export interface State {
  lastUpdate: number
  lastSave: number
  starSystems: StarSystemState
  map: MapState
  market: MarketState
  names: NameState
  bodies: BodyState
  dynamics: DynamicsState
  ships: ShipsState
}

export const init = (state: Draft<State>): void | State => {
  const loaded = loadObjectIntoDraft(state, 'state')
  if (!loaded) {
    chain(initDynamics)(state)
  }

  setRoute('ship3', {
    steps: [
      {
        location: 'spaceStation1',
        trades: [{ operation: 'buy', amount: 'all', comodity: 'energyCells' }],
      },
      {
        location: 'heavyWeapons',
        trades: [{ operation: 'sell', amount: 'all', comodity: 'energyCells' }],
      },
    ],
  })(state)
}

export const update = (state: Draft<State>): void => {
  const now = Date.now()
  while (state.lastUpdate < now) {
    const dtMs = Math.min(now - state.lastUpdate, updateMaximumDt)
    state.lastUpdate += dtMs
    const dt = dtMs / 1000
    chain(updateStarSystems(dt), updateDynamics(dt), updateMap, updateMarkets(dt))(state)
  }
  if (now - state.lastSave >= saveInterval) {
    state.lastSave = now
    saveObject(state, 'state')
  }
}
