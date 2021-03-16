import { Draft } from 'immer'
import { getNearestTradingLocation, isNamedLocation } from '../dynamics'
import { moveShip } from '../ships/mutations'
import { Mutation, State } from '../state'
import { maximumPossibleTradeItem } from './getters'
import { canConsumeFromCargo, canProduceIntoCargo, Production, scaleProduction } from './production'
import { getDefaultRate } from './rates'
import { getTotal, Trade } from './trade'
import { getLastLocation, TradeRouteStep } from './trade-route'

export const addStep = (id: string): Mutation<State> => (d) => {
  const route = d.market.routes[id]
  const location = getLastLocation(route) || getNearestTradingLocation(d, id)

  const rates = d.market.markets[location].rates
  const { operation, comodity } = getDefaultRate(rates)

  route.steps.push({ location, operation, comodity })
}

export const removeStep = (id: string, index: number): Mutation<State> => (d) => {
  const route = d.market.routes[id]
  route.steps.splice(index, 1)
  if (route.currentStep >= route.steps.length) {
    route.currentStep = 0
  }
}

export const updateStep = (id: string, index: number, update: Partial<TradeRouteStep>): Mutation<State> => (d) => {
  const steps = d.market.routes[id].steps
  steps[index] = {
    ...steps[index],
    ...update,
  }
}

export const performTrade = (from: string, to: string, trade: Trade): Mutation<State> => (d) => {
  console.log('trade', from, to, trade)
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

export const updateMarkets = (dt: number): Mutation<State> => (d) => {
  Object.entries(d.market.markets).forEach(([id, market]) => {
    Object.values(market.production).forEach((production) => {
      applyProduction(d, dt, id, production)
    })
  })
}

export const updateTradeRoutes: Mutation<State> = (d) => {
  Object.entries(d.market.routes).forEach(([id, route]) => {
    if (route.steps.length <= 1 || route.steps[route.currentStep] === undefined) {
      return
    }

    const position = d.dynamics.positions[id]
    if (isNamedLocation(position)) {
      const step = route.steps[route.currentStep]
      if (step.location === position) {
        const fromOperation = step.operation === 'sell' ? 'buy' : 'sell'
        const item = maximumPossibleTradeItem(d, position, id, step.comodity, fromOperation, step.amount)
        if (item !== undefined) {
          performTrade(position, id, { [step.comodity]: item })(d)
        }
        route.currentStep = (route.currentStep + 1) % route.steps.length
      } else {
        const speed = d.ships.specs[id].speed
        moveShip(id, step.location, speed)(d)
      }
    }
  })
}
