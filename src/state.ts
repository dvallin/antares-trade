import { Draft } from 'immer'

import { getOrbitPosition, StarSystemState, updateStarSystems } from './star-system/state'
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
    initDynamics(state)

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
      createShip({
        id: 'solarPanel',
        type: 'station',
        owner: 'ai',
        name: 'Solar Panel',
        location: { x: 250, y: 0, system: 'sol' },
        totalCargo: 20000,
        totalDocks: 4,
        speed: 0.05,
        stock: {},
        market: {
          production: [
            {
              resource: ['luminocity'],
              consumes: {},
              produces: { energyCells: 100 },
            },
          ],
          rates: {
            energyCells: { sell: 1 },
          },
        },
      }),
      createShip({
        id: 'heavyWeapons',
        type: 'station',
        owner: 'ai',
        name: 'Heavy Weapons Factory',
        location: 'mars',
        totalCargo: 20000,
        totalDocks: 4,
        speed: 0.0,
        stock: { clothing: 20, food: 100, energyCells: 100, uranium: 20 },
        market: {
          production: [
            {
              resource: [],
              consumes: { energyCells: 5, uranium: 1 },
              produces: { toxicWaste: 1, heavyWeapons: 1 },
            },
            {
              resource: [],
              consumes: { clothing: 1, food: 2 },
              produces: {},
            },
          ],
          rates: {
            clothing: { buy: 10 },
            food: { buy: 8 },
            energyCells: { buy: 8 },
            uranium: { buy: 100 },
            heavyWeapons: { sell: 3000 },
            toxicWaste: { sell: -1 },
          },
        },
      }),
      createShip({
        id: 'spaceStation1',
        type: 'station',
        owner: 'ai',
        name: 'Earth Trading Station',
        location: getOrbitPosition(state, 'earth', 0.3, 0),
        totalCargo: 20000,
        totalDocks: 100,
        speed: 0.01,
        stock: { clothing: 20, food: 100, energyCells: 100 },
        market: {
          production: [],
          rates: {
            clothing: { buy: 2, sell: 3 },
            food: { buy: 5, sell: 6 },
            energyCells: { buy: 3, sell: 4 },
          },
        },
      }),
      createShip({
        id: 'fluxTube',
        type: 'station',
        owner: 'ai',
        name: 'Flux Tube',
        location: getOrbitPosition(state, 'jupiter', 1, 0),
        totalCargo: 20000,
        totalDocks: 4,
        speed: 0.05,
        stock: {},
        market: {
          production: [
            {
              resource: ['magnetism'],
              consumes: {},
              produces: { energyCells: 100 },
            },
          ],
          rates: {
            energyCells: { sell: 1 },
          },
        },
      }),
      createShip({
        id: 'advancedMaterials',
        type: 'station',
        owner: 'ai',
        name: 'Advanced Materials Factory',
        location: getOrbitPosition(state, 'jupiter', 2, 0),
        totalCargo: 20000,
        totalDocks: 4,
        speed: 0.0,
        stock: { energyCells: 100, metals: 100 },
        market: {
          production: [
            {
              resource: ['radiation'],
              consumes: { energyCells: 2, metals: 2 },
              produces: { advancedMaterials: 10 },
            },
          ],
          rates: {
            energyCells: { buy: 3 },
            metals: { buy: 3 },
            advancedMaterials: { sell: 10 },
          },
        },
      }),
      createShip({
        id: 'biomass1',
        type: 'station',
        owner: 'ai',
        name: 'Venuvian floating gardens',
        location: 'venus',
        totalCargo: 20000,
        totalDocks: 4,
        speed: 0.0,
        stock: { energyCells: 100, metals: 100 },
        market: {
          production: [
            {
              resource: [],
              consumes: { energyCells: 2 },
              produces: { biomass: 3, food: 3 },
            },
          ],
          rates: {
            energyCells: { buy: 3 },
            biomass: { sell: 2 },
            food: { sell: 3 },
          },
        },
      })
    )(state)
  }
}

export const update = (state: Draft<State>): void => {
  const now = Date.now()
  const dtMs = Math.min(now - state.lastUpdate, updateMaximumDt)
  while (state.lastUpdate < now && Date.now() - now < 100) {
    state.lastUpdate += dtMs
    const dt = dtMs / 1000
    chain(updateStarSystems(dt), updateDynamics(dt), updateMap, updateMarkets(dt), updateTradeRoutes)(state)
  }
  if (now - state.lastSave >= saveInterval) {
    state.lastSave = now
    saveObject(state, stateVersion, 'state')
  }
}
