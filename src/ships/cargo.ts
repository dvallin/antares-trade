export interface Cargo {
  total: number
  stock: { [comodity: string]: number }
}

export function getUsedCargo(cargo: Cargo): number {
  return Object.values(cargo.stock).reduce((a, b) => a + b, 0)
}

export function getComodityAmount(cargo: Cargo, comodity: string): number {
  return Math.floor(cargo.stock[comodity] || 0)
}
