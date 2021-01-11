import * as redux from 'redux'
import * as infernoRedux from 'inferno-redux'
import { starSystems, StarSystemState } from './star-system/state'
import { map, MapState } from './map/state'
import { names, NameState } from './name/state'
import { bodies, BodyState } from './body/state'
import { dynamics, DynamicsState, updateSystem } from './dynamics/state'

import { Component } from 'inferno'
import produce from 'immer'

export interface Storage<C> {
  [entity: string]: C
}

export interface State {
  starSystems: StarSystemState
  map: MapState
  names: NameState
  bodies: BodyState
  dynamics: DynamicsState
}

export interface TickAction {
  type: 'TICK'
}

const combinedReducer = redux.combineReducers({ starSystems, map, names, bodies, dynamics })
const reducer = (state: State, action: TickAction): State => {
  switch (action.type) {
    case 'TICK':
      return produce(state, (s) => updateSystem(s))
    default:
      return combinedReducer(state, action)
  }
}

export function createStore(): redux.Store<State> {
  return redux.createStore(reducer)
}

export function connect<T extends Function>(
  stateToProps?: (state: State) => any,
  dispatchToProps?: (dispatch: redux.Dispatch) => any
): (c: T) => typeof Component {
  return (c) => (infernoRedux.connect(stateToProps, dispatchToProps)(c) as unknown) as typeof Component
}
