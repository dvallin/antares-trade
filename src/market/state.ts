import { Mutation, State, Storage } from '../state'
import { applyProduction, Production } from './production'
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
}

export const market: MarketState = {
  markets: {
    fluxTube: {
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
    solarPanel: {
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
    advancedMaterials: {
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
    spaceStation1: {
      production: [],
      rates: {
        clothing: { buy: 2, sell: 3 },
        food: { buy: 1, sell: 2 },
        energyCells: { buy: 3, sell: 4 },
      },
    },
    heavyWeapons: {
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
  },
  balances: { player: 100, ai: 2000 },
  routes: {
    ship3: { currentStep: 0, steps: [] },
  },
}

export const updateMarkets = (dt: number): Mutation<State> => (d) => {
  Object.entries(d.market.markets).forEach(([id, market]) => {
    Object.values(market.production).forEach((production) => {
      applyProduction(d, dt, id, production)
    })
  })
}

export function isTradingLocation(state: State, location: string): boolean {
  return state.market.markets[location]?.rates !== undefined
}
