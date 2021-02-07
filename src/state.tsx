import { initialState as starSystems, StarSystemState } from './star-system/state'
import { initialState as map, MapState } from './map/state'
import { initialState as names, NameState } from './name/state'
import { initialState as bodies, BodyState } from './body/state'
import { initialState as dynamics, DynamicsState } from './dynamics/state'

import produce, { Draft } from 'immer'

export type Storage<T> = {
  [key: string]: T
}

export interface State {
  starSystems: StarSystemState
  map: MapState
  names: NameState
  bodies: BodyState
  dynamics: DynamicsState
}

export let state: State = {
  starSystems: starSystems(),
  map: map(),
  names: names(),
  bodies: bodies(),
  dynamics: dynamics(),
}

export type Mutation<State> = (draft: Draft<State>) => void

export type Mutate = (mutation: Mutation<State>) => void

export function mutate(mutation: Mutation<State>): void {
  state = produce(state, mutation)
}
