import produce, { Draft } from 'immer'
import { Resources } from '../body/state'
import { Cargo, getUsedCargo } from '../ships/cargo'
import { State } from '../state'
import { getResource } from './resources'

export interface Production {
  resource: (keyof Resources)[]
  consumes: { [comodity: string]: number }
  produces: { [comodity: string]: number }
}

export const productionTimestep = 3600

export function scaleProduction(production: Production, scale: number): Production {
  return produce(production, (p) => {
    Object.entries(p.consumes).forEach(([k, v]) => (p.consumes[k] = v * scale))
    Object.entries(p.produces).forEach(([k, v]) => (p.produces[k] = v * scale))
  })
}

export function getResourceScalar(state: State, production: Production, id: string): number {
  const resources = production.resource.map((r) => getResource(state, r, id))
  return resources.length > 0 ? resources.reduce((previous, scale) => Math.min(previous, scale)) : 1
}

export function canConsumeFromCargo(production: Production, cargo: Cargo): boolean {
  return Object.entries(production.consumes).every(([k, v]) => cargo.stock[k] >= v)
}

export function canProduceIntoCargo(production: Production, cargo: Cargo): boolean {
  return getUsedCargo(cargo) + Object.values(production.produces).reduce((a, b) => a + b, 0) <= cargo.total
}

export const applyProduction = (state: Draft<State>, dt: number, id: string, production: Production): void => {
  const cargo = state.ships.cargo[id]

  if (cargo) {
    const resourceScale = getResourceScalar(state, production, id)
    const timeScale = dt / productionTimestep
    const scaledProduction = scaleProduction(production, resourceScale * timeScale)
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
