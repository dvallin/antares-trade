import { distSquared } from '../geometry'
import { isTradingLocation } from '../market/getters'
import { isDockableLocation } from '../ships/getters'
import { State } from '../state'
import { getPosition } from './getters'

export interface Movement {
  to: Location
  v: number
  eta: number
}
export type Trajectory = { id: string; from: Position; to: Position }

export type Location = string | Position
export const isNamedLocation = (l: Location): l is string => typeof l === 'string'

export interface Position {
  system: string
  x: number
  y: number
}

export function collectEntities(state: State, system: string): string[] {
  return Object.entries(state.dynamics.positions)
    .map(([id, l]) => ({ id, position: getPosition(state, l) }))
    .filter(({ position }) => position.system === system)
    .map(({ id }) => id)
}

export function collectTrajectories(state: State, system: string): Trajectory[] {
  return Object.entries(state.dynamics.movements)
    .map(([id, movement]) => ({ id, from: getPosition(state, id), to: getPosition(state, movement.to) }))
    .filter(({ from, to }) => from.system === system || to.system === system)
}

export function collectDockableLocations(state: State, ship: string): string[] {
  const p = getPosition(state, ship)
  return Object.entries(state.dynamics.positions)
    .map(([id, l]) => ({ id, position: getPosition(state, l) }))
    .filter(({ position }) => position.system === p.system)
    .filter(({ id }) => isDockableLocation(state, id))
    .map(({ id, position }) => ({ id, dist: distSquared(position.x, position.y, p.x, p.y) }))
    .sort((l, r) => l.dist - r.dist)
    .map(({ id }) => id)
}

export function collectTradingLocations(state: State, ship: string): string[] {
  const p = getPosition(state, ship)
  return Object.entries(state.dynamics.positions)
    .map(([id, l]) => ({ id, position: getPosition(state, l) }))
    .filter(({ position }) => position.system === p.system)
    .filter(({ id }) => isTradingLocation(state, id))
    .map(({ id, position }) => ({ id, dist: distSquared(position.x, position.y, p.x, p.y) }))
    .sort((l, r) => l.dist - r.dist)
    .map(({ id }) => id)
}
