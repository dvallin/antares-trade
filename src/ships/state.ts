import { Movement, setMovement } from '../dynamics/movement'
import { detachOrbit } from '../star-system/state'
import { chain, Mutation, State, Storage } from '../state'
import { Cargo } from './cargo'
import { Docks, undockShip } from './docks'

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

export const docks = (total: number): Docks => ({ total, docked: [] })
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

export const isControlledBy = (state: State, ship: string, player: string): boolean => state.ships.controllable[ship]?.by === player

export const moveShip = (ship: string, to: Movement['to'], v: number): Mutation<State> =>
  chain(undockShip(ship), detachOrbit(ship), setMovement(ship, to, v))
