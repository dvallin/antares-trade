import { isNamedLocation, Movement, setMovement } from '../dynamics/state'
import { detachOrbit } from '../star-system/state'
import { chain, Mutation, State, Storage } from '../state'

export interface Specs {
  type: 'freighter' | 'station' | 'fighter'
  speed: number
  docks: Docks
}

export interface Controllable {
  by: string
}

export interface Docks {
  free: number
  total: number
}

const docks = (total: number): Docks => ({ free: total, total })

export interface ShipsState {
  controllable: Storage<Controllable>
  specs: Storage<Specs>
}

export const ships: ShipsState = {
  controllable: {
    ship1: { by: 'ai' },
    ship2: { by: 'player' },
    ship3: { by: 'player' },
    spaceStation1: { by: 'ai' },
    heavyWeapons: { by: 'ai' },
  },
  specs: {
    ship1: { type: 'fighter', speed: 0.7, docks: docks(0) },
    ship2: { type: 'fighter', speed: 0.6, docks: docks(0) },
    ship3: { type: 'freighter', speed: 0.2, docks: docks(2) },
    spaceStation1: { type: 'station', speed: 0.01, docks: docks(100) },
    heavyWeapons: { type: 'station', speed: 0.0, docks: docks(4) },
  },
}

export const isDockable = (state: State, location: string): boolean => {
  const docks = state.ships.specs[location]?.docks
  if (docks?.total > 0) {
    return true
  }
  return false
}

export const canDockAt = (state: State, _ship: string, location: string): boolean => {
  const docks = state.ships.specs[location]?.docks
  if (docks?.free > 0) {
    return true
  }
  return false
}

export const dockAt = (location: string): Mutation<State> => (d) => {
  const docks = d.ships.specs[location]?.docks
  if (docks?.free > 0) {
    docks.free--
  }
}

export const undockShip = (id: string): Mutation<State> => (d) => {
  const p = d.dynamics.positions[id]
  if (isNamedLocation(p)) {
    const docks = d.ships.specs[p]?.docks
    if (docks !== undefined) {
      docks.free = Math.max(docks.total, docks.free + 1)
    }
  }
}

export const moveShip = (ship: string, to: Movement['to'], v: number): Mutation<State> =>
  chain(undockShip(ship), detachOrbit(ship), setMovement(ship, to, v))
