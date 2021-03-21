import produce from 'immer'

import { initialState } from '../src/application-state'
import { getLocation, Position } from '../src/dynamics/position'
import { initDynamics } from '../src/dynamics/state'
import { updateStarSystem } from '../src/star-system/state'
import { State } from '../src/state'

export function getAsPosition(state: State, id: string): Position {
  return getLocation(state, id) as Position
}

export const initialStateWithDynamics = produce(initialState, (d) => {
  initDynamics(d)
  updateStarSystem(1, d.starSystems.systems[d.starSystems.currentSystem])
})
