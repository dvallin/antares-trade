import { Draft } from 'immer'
import { isNamedLocation } from '../dynamics'
import { getAvailableCargo, getComodityAmount, getUsedCargo } from '../ships/cargo'
import { moveShip } from '../ships/state'
import { Mutation, State, Storage } from '../state'
import { canConsumeFromCargo, canProduceIntoCargo, Production, scaleProduction } from './production'
import { getRateSign, Rates } from './rates'
import { getTotal, Trade, TradeItem } from './trade'
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

export const maximumPossibleTradeItem = (
  state: State,
  from: string,
  to: string,
  comodity: string,
  operation: 'sell' | 'buy',
  maximumAmount: number | undefined
): TradeItem | undefined => {
  const sign = getRateSign(operation)

  const fromOwner = state.ships.controllable[from].by
  const toOwner = state.ships.controllable[to].by

  const rates = state.market.markets[from].rates
  const rate = rates[comodity]?.[operation]
  if (rate === undefined) {
    return undefined
  }
  const price = sign * rate

  const amounts = []
  if (maximumAmount !== undefined) {
    amounts.push(maximumAmount)
  }
  if (price < 0) {
    amounts.push(Math.floor(state.market.balances[fromOwner] / -price))
  } else {
    amounts.push(Math.floor(state.market.balances[toOwner] / price))
  }

  const fromCargo = state.ships.cargo[from]
  const toCargo = state.ships.cargo[to]
  if (operation === 'sell') {
    amounts.push(getComodityAmount(fromCargo, comodity))
    amounts.push(getAvailableCargo(toCargo))
  } else {
    amounts.push(getComodityAmount(toCargo, comodity))
    amounts.push(getAvailableCargo(fromCargo))
  }

  const amount = Math.min(...amounts)
  if (amount === 0) {
    return undefined
  }

  return { amount, price: amount * price }
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

export const applyProduction = (state: Draft<State>, dt: number, id: string, production: Production): void => {
  const cargo = state.ships.cargo[id]

  if (cargo) {
    const scaledProduction = scaleProduction(production, dt / 3600)
    if (canConsumeFromCargo(scaledProduction, cargo) && canProduceIntoCargo(scaledProduction, cargo)) {
      Object.entries(scaledProduction.consumes).forEach(([k, v]) => {
        cargo.stock[k] -= v
      })
      Object.entries(scaledProduction.produces).forEach(([k, v]) => {
        cargo.stock[k] = (cargo.stock[k] || 0) + v
      })
    }
  }
}

export const setRoute = (id: string, route: TradeRoute): Mutation<State> => (d) => {
  d.market.routes[id] = route
}

export const updateMarkets = (dt: number): Mutation<State> => (d) => {
  Object.entries(d.market.markets).forEach(([id, market]) => {
    Object.values(market.production).forEach((production) => {
      applyProduction(d, dt, id, production)
    })
  })
}

export const updateTradeRoutes: Mutation<State> = (d) => {
  Object.entries(d.market.routes).forEach(([id, route]) => {
    if (route.steps.length <= 1) {
      return
    }

    const position = d.dynamics.positions[id]
    if (isNamedLocation(position)) {
      const currentStep = route.steps.findIndex((step) => step.location === position)
      if (currentStep >= 0) {
        const transaction: Trade = {}
        route.steps[currentStep].trades.forEach((item) => {
          const fromOperation = item.operation === 'sell' ? 'buy' : 'sell'
          const t = maximumPossibleTradeItem(d, position, id, item.comodity, fromOperation, item.amount)
          if (t !== undefined) {
            transaction[item.comodity] = t
          }
        })
        performTrade(position, id, transaction)(d)
      }

      const speed = d.ships.specs[id].speed
      const nextStep = route.steps[(currentStep + 1) % route.steps.length]
      moveShip(id, nextStep.location, speed)(d)
    }
  })
}
