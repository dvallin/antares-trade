import { Draft } from 'immer'
import { collectTradingLocations, isNamedLocation } from '../dynamics'
import { moveShip } from '../ships/mutations'
import { Mutation, State } from '../state'
import { maximumPossibleTradeItem } from './getters'
import { canConsumeFromCargo, canProduceIntoCargo, Production, scaleProduction } from './production'
import { getComodities } from './rates'
import { getTotal, Trade } from './trade'
import { TradeRouteStep } from './trade-route'

export const addStep = (id: string): Mutation<State> => (d) => {
  const route = d.market.routes[id]
  let location: string
  if (route.steps.length > 0) {
    const lastStep = route.steps[route.steps.length - 1]
    location = lastStep.location
  } else {
    location = collectTradingLocations(d, id)[0]
  }
  const rates = d.market.markets[location].rates

  let operation: 'buy' | 'sell' = 'buy'
  let comodity = getComodities(rates, 'buy')[0]
  if (!comodity) {
    operation = 'sell'
    comodity = getComodities(rates, 'sell')[0]
  }

  route.steps.push({ location, operation, comodity })
}

export const removeStep = (id: string, index: number): Mutation<State> => (d) => {
  d.market.routes[id].steps.splice(index, 1)
}

export const updateStep = (id: string, index: number, update: Partial<TradeRouteStep>): Mutation<State> => (d) => {
  const steps = d.market.routes[id].steps
  steps[index] = {
    ...steps[index],
    ...update,
  }
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
        const step = route.steps[currentStep]
        const fromOperation = step.operation === 'sell' ? 'buy' : 'sell'
        const item = maximumPossibleTradeItem(d, position, id, step.comodity, fromOperation, step.amount)
        if (item !== undefined) {
          performTrade(position, id, { [step.comodity]: item })(d)
        }
      }

      const speed = d.ships.specs[id].speed
      const nextStep = route.steps[(currentStep + 1) % route.steps.length]
      moveShip(id, nextStep.location, speed)(d)
    }
  })
}
