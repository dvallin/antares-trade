import { Movement, setMovement } from '../dynamics/state'
import { detachOrbit } from '../star-system/state'
import { chain, Mutation, State, Storage } from '../state'

export interface Specs {
  speed: number
}

export interface Controllable {
  by: string
}

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
  },
  specs: {
    ship1: { speed: 0.7 },
    ship2: { speed: 0.6 },
    ship3: { speed: 0.2 },
    spaceStation1: { speed: 0.01 },
  },
}

export const moveShip = (ship: string, to: Movement['to'], v: number): Mutation<State> =>
  chain((d) => detachOrbit(ship, d.starSystems.currentSystem)(d), setMovement(ship, to, v))
