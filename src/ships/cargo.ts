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
