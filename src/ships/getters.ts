import { State } from '../state'
import { canDockAt, isDockable } from './docks'

export function isDockableLocation(state: State, location: string): boolean {
  const docks = state.ships.specs[location]?.docks
  return docks ? isDockable(docks) : false
}

export const canDockAtLocation = (state: State, _ship: string, location: string): boolean => {
  const docks = state.ships.specs[location]?.docks
  return docks ? canDockAt(docks) : false
}

export const getDockedShipsOfLocation = (state: State, location: string): string[] => state.ships.specs[location]?.docks.docked || []

export const isControlledBy = (state: State, ship: string, player: string): boolean => state.ships.controllable[ship]?.by === player
