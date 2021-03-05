import { distSquared } from '../geometry'
import { State } from '../state'
import { Position } from './state'

export function collectEntities(state: State, system: string): string[] {
  return Object.entries(state.dynamics.positions)
    .filter(([_, position]) => position.system === system)
    .map(([key]) => key)
}

export function collectNearEntities(state: State, center: Position): string[] {
  return Object.entries(state.dynamics.positions)
    .filter(([_, position]) => position.system === center.system)
    .map(([id, p]) => ({ id, dist: distSquared(p.x, p.y, center.x, center.y) }))
    .sort((l, r) => l.dist - r.dist)
    .map(({ id }) => id)
}
