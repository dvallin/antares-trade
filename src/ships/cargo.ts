import { Mutation, State } from '../state'

export type Stock = { [comodity: string]: number }
export interface Cargo {
  total: number
  stock: Stock
}

export function getUsedCargo(cargo: Cargo): number {
  return Object.values(cargo.stock).reduce((a, b) => a + b, 0)
}

export function getAvailableCargo(cargo: Cargo): number {
  return cargo.total - getUsedCargo(cargo)
}

export function getComodityAmount(cargo: Cargo, comodity: string): number {
  return Math.floor(cargo.stock[comodity] || 0)
}

export const updateStock = (id: string, comodity: string, delta: number): Mutation<State> => (s) => {
  const stock = s.ships.cargo[id].stock
  stock[comodity] = Math.max(0, (stock[comodity] || 0) + delta)
}
