import { distSquared } from '../geometry'
import { State } from '../state'
import { getPosition, Position } from './state'

export function collectEntities(state: State, system: string): string[] {
  return Object.entries(state.dynamics.positions)
    .map(([id, l]) => ({ id, position: getPosition(state, l) }))
    .filter(({ position }) => getPosition(state, position).system === system)
    .map(({ id }) => id)
}

export function collectNearEntities(state: State, center: Position): string[] {
  return Object.entries(state.dynamics.positions)
    .map(([id, l]) => ({ id, position: getPosition(state, l) }))
    .filter(({ position }) => position.system === center.system)
    .map(({ id, position }) => ({ id, dist: distSquared(position.x, position.y, center.x, center.y) }))
    .sort((l, r) => l.dist - r.dist)
    .map(({ id }) => id)
}
