export interface Docks {
  total: number
  docked: string[]
}

export function isDockable(docks: Docks): boolean {
  return docks.total > 0
}

export function canDockAt(docks: Docks): boolean {
  const free = docks.total - docks.docked.length
  if (free > 0) {
    return true
  }
  return false
}
