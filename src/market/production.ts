import produce from 'immer'
import { Cargo, getUsedCargo } from '../ships/cargo'

export interface Production {
  consumes: { [comodity: string]: number }
  produces: { [comodity: string]: number }
}

export function scaleProduction(production: Production, scale: number): Production {
  return produce(production, (p) => {
    Object.entries(p.consumes).forEach(([k, v]) => (p.consumes[k] = v * scale))
    Object.entries(p.produces).forEach(([k, v]) => (p.produces[k] = v * scale))
  })
}

export function canConsumeFromCargo(production: Production, cargo: Cargo): boolean {
  return Object.entries(production.consumes).find(([k, v]) => cargo.stock[k] < v) === undefined
}
export function canProduceIntoCargo(production: Production, cargo: Cargo): boolean {
  return getUsedCargo(cargo) + Object.values(production.produces).reduce((a, b) => a + b, 0) <= cargo.total
}
