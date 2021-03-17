import { Draft } from 'immer'
import { Mutation, State, Storage } from '../state'
import { applyMovement, Movement } from './movement'
import { applyStarSystem, Location } from './position'

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

export const initDynamics = (state: Draft<State>): void => {
  if (!state.dynamics.initialized) {
    Object.entries(state.starSystems.systems).forEach(([key, value]) => applyStarSystem(key, value)(state))
    state.dynamics.initialized = true
  }
}

export const updateDynamics = (dt: number): Mutation<State> => (d) => {
  Object.entries(d.starSystems.systems).forEach(([key, value]) => applyStarSystem(key, value)(d))
  Object.keys(d.dynamics.movements).forEach((id) => applyMovement(dt, id)(d))
}
