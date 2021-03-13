import { Location, Movement } from '.'
import { Storage } from '../state'

export interface DynamicsState {
  initialized: boolean
  movements: Storage<Movement>
  positions: Storage<Location>
}

export const dynamics: DynamicsState = {
  initialized: false,
  movements: {},
  positions: {
    spaceStation1: {
      system: 'sol',
      x: 498.3,
      y: 0,
    },
    heavyWeapons: 'mars',
    ship1: {
      system: 'sol',
      x: 398,
      y: 0,
    },
    ship2: 'spaceStation1',
    ship3: 'spaceStation1',
  },
}
