import { getUsedCargo } from '../ships/state'
import { Mutation, State, Storage } from '../state'

export type Trading = {
  [comodity: string]: {
    buy?: number
    sell?: number
  }
}
export type Stock = { [comodity: string]: number }
export interface Production {
  consumes: Stock
  produces: Stock
}
export interface Market {
  production: Production[]
  trading: Trading
}
export type Trade = { [comodity: string]: { amount: number; price: number } }

export interface MarketState {
  markets: Storage<Market>
  balances: Storage<number>
}

export const market: MarketState = {
  markets: {
    spaceStation1: {
      production: [],
      trading: {
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
      trading: {
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
}

export function getTotal(trade: Trade): { amount: number; price: number } {
  return Object.values(trade).reduce((a, b) => ({ amount: a.amount + b.amount, price: a.price + b.price }), { amount: 0, price: 0 })
}

export const validateTrade = (state: State, from: string, to: string, trade: Trade): string[] => {
  const errors: string[] = []

  const total = getTotal(trade)
  const fromOwner = state.ships.controllable[from].by
  const toOwner = state.ships.controllable[to].by
  if (state.market.balances[fromOwner] + total.price < 0) {
    errors.push(`${fromOwner} has insufficient credits`)
  }
  if (state.market.balances[toOwner] - total.price < 0) {
    errors.push(`${toOwner} has insufficient credits`)
  }

  const fromCargo = state.ships.cargo[from]
  const toCargo = state.ships.cargo[to]
  if (getUsedCargo(fromCargo) - total.amount > fromCargo.total) {
    errors.push(`${state.names.names[from]?.name || 'unknown ship'} has insufficient storage capacity`)
  }
  if (getUsedCargo(toCargo) + total.amount > toCargo.total) {
    errors.push(`${state.names.names[to]?.name || 'unknown ship'} has insufficient storage capacity`)
  }

  return errors
}

export const performTrade = (from: string, to: string, trade: Trade): Mutation<State> => (d) => {
  const total = getTotal(trade)
  const fromOwner = d.ships.controllable[from].by
  const toOwner = d.ships.controllable[to].by
  d.market.balances[fromOwner] += total.price
  d.market.balances[toOwner] -= total.price

  const fromCargo = d.ships.cargo[from]
  const toCargo = d.ships.cargo[to]
  Object.entries(trade).forEach(([comodity, { amount }]) => {
    fromCargo.stock[comodity] = (fromCargo.stock[comodity] || 0) - amount
    toCargo.stock[comodity] = (toCargo.stock[comodity] || 0) + amount
  })
}
