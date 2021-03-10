import { isNamedLocation, Movement, setMovement } from '../dynamics/state'
import { detachOrbit } from '../star-system/state'
import { chain, Mutation, State, Storage } from '../state'
import { Cargo } from './cargo'
import { canDockAt, Docks, isDockable } from './docks'

export interface Specs {
  type: 'freighter' | 'station' | 'fighter'
  speed: number
  docks: Docks
}

export interface Controllable {
  by: string
}

export interface ShipsState {
  controllable: Storage<Controllable>
  specs: Storage<Specs>
  cargo: Storage<Cargo>
}

const docks = (total: number): Docks => ({ total, docked: [] })
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
  cargo: {
    ship1: {
      total: 200,
      stock: {},
    },
    ship2: {
      total: 200,
      stock: { energyCells: 20, food: 50 },
    },
    ship3: {
      total: 20000,
      stock: { energyCells: 30 },
    },
    heavyWeapons: {
      total: 20000,
      stock: { clothing: 20, food: 100, energyCells: 100, uranium: 20 },
    },
    spaceStation1: {
      total: 20000,
      stock: { clothing: 20, food: 100, energyCells: 100 },
    },
  },
}

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

export const moveShip = (ship: string, to: Movement['to'], v: number): Mutation<State> =>
  chain(undockShip(ship), detachOrbit(ship), setMovement(ship, to, v))
