import { getNearestTradingLocation } from '../dynamics'
import { isNamedLocation } from '../dynamics/position'
import { moveShip } from '../ships/state'
import { Mutation, State } from '../state'
import { getDefaultRate } from './rates'
import { maximumPossibleTradeItem, performTrade } from './trade'

export interface TradeRouteStep {
  location: string
  operation: 'buy' | 'sell'
  comodity: string
  amount?: number
}

export interface TradeRoute {
  currentStep: number
  steps: TradeRouteStep[]
}

export function getLastLocation(route: TradeRoute): string | undefined {
  return route.steps[route.steps.length - 1]?.location
}

export const addStep = (id: string): Mutation<State> => (d) => {
  const route = d.market.routes[id]
  const location = getLastLocation(route) || getNearestTradingLocation(d, id)

  if (location) {
    const rates = d.market.markets[location].rates
    const { operation, comodity } = getDefaultRate(rates)
    route.steps.push({ location, operation, comodity })
  }
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
