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
  return docks.total > docks.docked.length
}

export const dockAt = (id: string, location: string): Mutation<State> => (d) => {
  const docks = d.ships.specs[location]?.docks
  if (docks) {
    docks.docked.push(id)
  }
}

export function mapDock<T>(state: State, id: string, fn: (dock: Docks, location: string) => T): T | undefined {
  const p = state.dynamics.positions[id]
  if (isNamedLocation(p)) {
    const docks = state.ships.specs[p]?.docks
    if (docks) {
      return fn(docks, p)
    }
  }
  return undefined
}

export const isDocked = (state: State, id: string): boolean => mapDock(state, id, (docks) => docks.docked.includes(id)) || false

export const undockShip = (id: string): Mutation<State> => (state) =>
  mapDock(state, id, (docks) => {
    docks.docked = docks.docked.filter((v) => v !== id)
  })

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
