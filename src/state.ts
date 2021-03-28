import { Draft } from 'immer'

import { StarSystemState, updateStarSystems } from './star-system/state'
import { MapState, updateMap } from './map/state'
import { NameState } from './meta-data/state'
import { BodyState } from './body/state'
import { createShip, ShipsState } from './ships/state'

import { DynamicsState, initDynamics, updateDynamics } from './dynamics/state'
import { MarketState, updateMarkets } from './market/state'

import { loadObjectIntoDraft, saveObject } from './local-storage'
import { updateTradeRoutes } from './market/trade-route'

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

const stateVersion = '3'

export const init = (state: Draft<State>): void | State => {
  const loaded = loadObjectIntoDraft(state, stateVersion, 'state')
  if (!loaded) {
    chain(
      createShip({
        id: 'ship1',
        type: 'fighter',
        owner: 'ai',
        name: 'Pirate Interceptor',
        location: {
          system: 'sol',
          x: 398,
          y: 0,
        },
        totalCargo: 200,
        totalDocks: 0,
        speed: 0.7,
      }),
      createShip({
        id: 'ship2',
        type: 'fighter',
        owner: 'player',
        name: 'Frigate Mk1',
        location: 'ceres',
        totalCargo: 200,
        totalDocks: 0,
        speed: 0.6,
        stock: { energyCells: 20, food: 50 },
      }),
      createShip({
        id: 'ship3',
        type: 'freighter',
        owner: 'player',
        name: 'Heavy Freighter Mk2',
        location: 'spaceStation1',
        totalCargo: 20000,
        totalDocks: 2,
        speed: 0.2,
        stock: { energyCells: 30 },
      }),
      initDynamics
    )(state)
  }
}

export const update = (state: Draft<State>): void => {
  const now = Date.now()
  while (state.lastUpdate < now) {
    const dtMs = Math.min(now - state.lastUpdate, updateMaximumDt)
    state.lastUpdate += dtMs
    const dt = dtMs / 1000
    chain(updateStarSystems(dt), updateDynamics(dt), updateMap, updateMarkets(dt), updateTradeRoutes)(state)
  }
  if (now - state.lastSave >= saveInterval) {
    state.lastSave = now
    saveObject(state, stateVersion, 'state')
  }
}
