import { Storage } from '../state'
import { Production } from './production'
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
          consumes: { energyCells: 5, uranium: 1 },
          produces: { toxicWaste: 1, heavyWeapons: 1 },
        },
        {
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
  routes: {},
}
