import { Storage } from '../store'

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

export const initialState = (): ShipsState => ({
  controllable: {
    ship1: { by: 'ai' },
    ship2: { by: 'player' },
    ship3: { by: 'player' },
  },
  specs: {
    ship1: { speed: 0.7 },
    ship2: { speed: 0.7 },
    ship3: { speed: 0.7 },
  },
})

export const ships = (state: ShipsState = initialState()): ShipsState => {
  return state
}
