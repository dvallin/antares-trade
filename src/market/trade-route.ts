import { getNearestTradingLocation } from '../dynamics'
import { closedRouteEnergyCost, isNamedLocation } from '../dynamics/position'
import { getComodityAmount } from '../ships/cargo'
import { moveShip } from '../ships/state'
import { Mutation, State } from '../state'
import { getDefaultRate } from './rates'
import { maximumPossibleTradeItem, performTrade } from './trade'

export interface TradeRouteStep {
  location: string
  operation: 'buy' | 'sell'
  comodity: string
  percentage?: number
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

export const restart = (id: string): Mutation<State> => (d) => {
  const route = d.market.routes[id]
  route.currentStep = 0

  const step = route.steps[route.currentStep]
  const speed = d.ships.specs[id].speed
  moveShip(id, step.location, speed)(d)
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

export const updateTradeRoutes: Mutation<State> = (state) => {
  Object.entries(state.market.routes).forEach(([id, route]) => {
    if (route.steps.length <= 1 || route.steps[route.currentStep] === undefined) {
      return
    }

    const position = state.dynamics.positions[id]
    if (isNamedLocation(position)) {
      const step = route.steps[route.currentStep]
      const routeEnergyCost = closedRouteEnergyCost(
        state,
        route.steps.map((s) => s.location)
      )

      if (step.location === position) {
        const fromOperation = step.operation === 'sell' ? 'buy' : 'sell'
        let available = getComodityAmount(step.operation === 'sell' ? state.ships.cargo[id] : state.ships.cargo[position], step.comodity)
        if (step.operation === 'sell' && step.comodity === 'energyCells') {
          available = Math.max(0, available - routeEnergyCost)
        }
        const maxAmount = Math.ceil((step.percentage || 1) * available)
        const item = maximumPossibleTradeItem(state, position, id, step.comodity, fromOperation, maxAmount)
        if (item !== undefined) {
          performTrade(position, id, { [step.comodity]: item })(state)
        }

        route.currentStep = (route.currentStep + 1) % route.steps.length
      } else {
        // try to buy some energy cells before leaving
        const currentEnergyCells = getComodityAmount(state.ships.cargo[id], 'energyCells')
        if (currentEnergyCells < routeEnergyCost) {
          const item = maximumPossibleTradeItem(state, position, id, 'energyCells', 'sell', routeEnergyCost - currentEnergyCells)
          if (item !== undefined) {
            performTrade(position, id, { [step.comodity]: item })(state)
          }
        }

        const speed = state.ships.specs[id].speed
        moveShip(id, step.location, speed)(state)
      }
    }
  })
}
