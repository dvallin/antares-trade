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
    heavyWeapons: 'mars',
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
