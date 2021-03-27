import { isNamedLocation } from '../dynamics/position'
import { Mutation, State } from '../state'

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

export const dockAt = (id: string, location: string): Mutation<State> => (d) => {
  const docks = d.ships.specs[location]?.docks
  if (docks) {
    docks.docked.push(id)
  }
}

export const undockShip = (id: string): Mutation<State> => (d) => {
  const p = d.dynamics.positions[id]
  if (isNamedLocation(p)) {
    const docks = d.ships.specs[p]?.docks
    if (docks) {
      docks.docked = docks.docked.filter((v) => v !== id)
    }
  }
}

export function isDockableLocation(state: State, location: string): boolean {
  const docks = state.ships.specs[location]?.docks
  return docks ? isDockable(docks) : false
}

export const canDockAtLocation = (state: State, _ship: string, location: string): boolean => {
  const docks = state.ships.specs[location]?.docks
  return docks ? canDockAt(docks) : false
}

export const getDockedShipsOfLocation = (state: State, location: string): string[] => {
  return state.ships.specs[location]?.docks.docked || []
}
