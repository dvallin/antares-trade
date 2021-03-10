import { distSquared } from '../geometry'
import { isDockableLocation } from '../ships/state'
import { State } from '../state'
import { getPosition, Trajectory } from './state'

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
