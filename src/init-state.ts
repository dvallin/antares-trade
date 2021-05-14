import { Draft } from 'immer'

import { getOrbitPosition } from './star-system/state'
import { createShip, CreateShipProps } from './ships/state'

import { initDynamics } from './dynamics/state'
import { getDemandPerHour, getProductionPerHour } from './market/state'

import { loadObjectIntoDraft } from './local-storage'
import { collectTradingLocations } from './dynamics'
import { fromPolar } from './polar'
import { createEntropy, integer, MersenneTwister19937, string } from 'random-js'
import { chain, State } from './state'

export const stateVersion = '3'

const seed = createEntropy()
const mt = MersenneTwister19937.seedWithArray(seed)

const generateId = () => string()(mt, 8)

function sampleSolarPanel(): CreateShipProps {
  const [x, y] = fromPolar({ radius: integer(200, 300)(mt), phi: integer(-Math.PI, Math.PI)(mt) }, 0, 0)
  return {
    id: `solarPanel-${generateId()}`,
    type: 'station',
    owner: 'player',
    name: 'Solar Panel',
    location: { x, y, system: 'sol' },
    totalCargo: 200000,
    totalDocks: 4,
    speed: 0.05,
    stock: { energyCells: 100 },
    market: {
      production: [
        {
          resource: ['luminosity'],
          consumes: {},
          produces: { energyCells: 10000 },
        },
      ],
      rates: {
        energyCells: { sell: 1 },
      },
    },
  }
}

function sampleFloatingGardens(): CreateShipProps {
  return {
    id: `floating-gardens-${generateId()}`,
    type: 'station',
    owner: 'player',
    name: 'Venuvian floating gardens',
    location: 'venus',
    totalCargo: 200000,
    totalDocks: 4,
    speed: 0.0,
    stock: { energyCells: 100, metals: 100 },
    market: {
      production: [
        {
          resource: [],
          consumes: { energyCells: 1000 },
          produces: { biomass: 30000, food: 30000 },
        },
      ],
      rates: {
        energyCells: { buy: 3, sell: 6 },
        biomass: { sell: 2 },
        food: { sell: 3 },
      },
    },
  }
}

type SellTarget = { id: string; amount: number }
function freighterTradingBetween(source: string, targets: SellTarget[], comodity: string): CreateShipProps {
  const totalAmount = targets.map((t) => t.amount).reduce((a, b) => a + b, 0)
  return {
    id: `freigter-${generateId()}`,
    type: 'freighter',
    owner: 'player',
    name: 'Heavy Freighter Mk2',
    location: source,
    totalCargo: 20000,
    totalDocks: 2,
    speed: 0.2,
    stock: { energyCells: 30 },
    tradeRoute: {
      currentStep: 0,
      steps: [
        { location: source, operation: 'buy', comodity },
        ...targets.map((target) => ({
          location: target.id,
          percentage: target.amount / totalAmount,
          operation: 'sell' as 'sell' | 'buy',
          comodity,
        })),
      ],
    },
  }
}

export type DemandById = { id: string; demand: number }
function getDemands(state: State, system: string, comodity: string): DemandById[] {
  return collectTradingLocations(state, system)
    .map(({ id }) => ({ id, demand: getDemandPerHour(state, id, comodity) }))
    .filter(({ demand }) => demand > 0)
}

export type ProductionById = { id: string; production: number }
function createSourcesByDemand(
  state: Draft<State>,
  comodity: string,
  targets: DemandById[],
  sample: () => CreateShipProps
): ProductionById[] {
  // look at global demand
  // Improvement: cluster locations by their distance to potential sources
  let remainingDemand = targets.reduce((sum, item) => sum + item.demand, 0)

  // Improvement: give cluster information into sample function
  const sources: ProductionById[] = []
  while (remainingDemand > 0) {
    const create = sample()
    createShip(create)(state)
    const production = getProductionPerHour(state, create.id, comodity)
    remainingDemand -= production
    sources.push({ id: create.id, production })
  }
  return sources
}

function createFreighterForEachSource(state: Draft<State>, sources: ProductionById[], targets: DemandById[], comodity: string): void {
  let targetFulfilled = 0
  let currentTarget = 0
  for (const source of sources) {
    const selectedTargets: SellTarget[] = []
    let sourceRemaining = source.production
    while (sourceRemaining > 0 && currentTarget < targets.length) {
      const target = targets[currentTarget]
      selectedTargets.push({ id: target.id, amount: target.demand })
      sourceRemaining -= target.demand - targetFulfilled
      targetFulfilled += source.production
      if (targetFulfilled > target.demand) {
        currentTarget++
        targetFulfilled = 0
      }
    }
    if (selectedTargets.length > 0) {
      const create = freighterTradingBetween(source.id, selectedTargets, comodity)
      createShip(create)(state)
    }
  }
}

const createFoodChain = (state: Draft<State>, system: string): void => {
  const targets = getDemands(state, system, 'food')
  const sources = createSourcesByDemand(state, 'food', targets, sampleFloatingGardens)
  createFreighterForEachSource(state, sources, targets, 'food')
}
const createEnergyChain = (state: Draft<State>, system: string): void => {
  const targets = getDemands(state, system, 'energyCells')
  const sources = createSourcesByDemand(state, 'energyCells', targets, sampleSolarPanel)
  createFreighterForEachSource(state, sources, targets, 'energyCells')
}

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
            energyCells: { buy: 8, sell: 20 },
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
        id: 'earthStation',
        type: 'station',
        owner: 'ai',
        name: 'Earth CPM',
        location: 'earth',
        totalCargo: 100000000,
        totalDocks: 100,
        speed: 0.0,
        stock: { food: 100000, energyCells: 100000, clothing: 100000 },
        market: {
          production: [
            {
              resource: [],
              consumes: { food: 100000 },
              produces: {},
            },
            {
              resource: [],
              consumes: { energyCells: 100000 },
              produces: {},
            },
            {
              resource: [],
              consumes: { clothing: 100000 },
              produces: {},
            },
          ],
          rates: {
            clothing: { buy: 6, sell: 12 },
            food: { buy: 10, sell: 15 },
            energyCells: { buy: 6, sell: 10 },
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
            energyCells: { buy: 8, sell: 20 },
            metals: { buy: 3 },
            advancedMaterials: { sell: 10 },
          },
        },
      })
    )(state)

    createFoodChain(state, 'sol')
    createEnergyChain(state, 'sol')
  }
}
