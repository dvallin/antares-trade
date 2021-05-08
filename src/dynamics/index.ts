import { distSquared } from '../geometry'
import { Body } from '../body/state'
import { isTradingLocation } from '../market/state'
import { isDockableLocation } from '../ships/docks'
import { Specs } from '../ships/state'
import { State } from '../state'
import { Trajectory } from './movement'
import { getPosition, Position } from './position'

export const relevant: Filter = ['fighter', 'freighter', 'station']
export const ships: Filter = ['fighter', 'freighter']
export const stations: Filter = ['station']
export const bodies: Filter = ['star', 'gas-giant', 'moon', 'planet', 'belt']
export const orbitable: Filter = ['star', 'gas-giant', 'moon', 'planet']
export type Filter = (Body['type'] | Specs['type'])[]

export function filterEntities(state: State, entities: string[], filter: Filter): string[] {
  return entities.filter(
    (id) => filter.length === 0 || filter.includes(state.bodies.bodies[id]?.type) || filter.includes(state.ships.specs[id]?.type)
  )
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

export function collectDockableLocationsSortedByDistance(state: State, ship: string): string[] {
  const p = getPosition(state, ship)
  return Object.entries(state.dynamics.positions)
    .map(([id, l]) => ({ id, position: getPosition(state, l) }))
    .filter(({ position }) => position.system === p.system)
    .filter(({ id }) => isDockableLocation(state, id))
    .map(({ id, position }) => ({ id, dist: distSquared(position.x, position.y, p.x, p.y) }))
    .sort((l, r) => l.dist - r.dist)
    .map(({ id }) => id)
}

export function collectTradingLocationsSortedByDistance(state: State, ship: string): string[] {
  const p = getPosition(state, ship)
  return collectTradingLocations(state, p.system)
    .map(({ id, position }) => ({ id, dist: distSquared(position.x, position.y, p.x, p.y) }))
    .sort((l, r) => l.dist - r.dist)
    .map(({ id }) => id)
}

export type IdWithPosition = { id: string; position: Position }

export function collectLocations(state: State, system: string): IdWithPosition[] {
  return Object.entries(state.dynamics.positions)
    .map(([id, l]) => ({ id, position: getPosition(state, l) }))
    .filter(({ position }) => position.system === system)
}

export function collectDockableLocations(state: State, system: string): IdWithPosition[] {
  return collectLocations(state, system).filter(({ id }) => isDockableLocation(state, id))
}

export function collectTradingLocations(state: State, system: string): IdWithPosition[] {
  return collectLocations(state, system).filter(({ id }) => isTradingLocation(state, id))
}

export function getNearestTradingLocation(state: State, ship: string): string | undefined {
  return collectTradingLocationsSortedByDistance(state, ship)[0]
}
