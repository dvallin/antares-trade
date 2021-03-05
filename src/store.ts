import * as redux from 'redux'
import * as infernoRedux from 'inferno-redux'
import { starSystems, StarSystemState } from './star-system/state'
import { map, MapAction, MapState, updateMap } from './map/state'
import { names, NameState } from './name/state'
import { bodies, BodyState } from './body/state'
import { ships, ShipsState } from './ships/state'
import { dynamics, DynamicsAction, DynamicsState, updateDynamics } from './dynamics/state'

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
  ships: ShipsState
}

export type Action = MapAction | DynamicsAction

export interface TickAction {
  type: 'TICK'
}

const combinedReducer = redux.combineReducers({ starSystems, map, names, bodies, dynamics, ships })
const reducer = (state: State, action: TickAction): State => {
  switch (action.type) {
    case 'TICK':
      return produce(state, (s) => {
        updateDynamics(s)
        updateMap(s)
      })
    default:
      return combinedReducer(state, action)
  }
}

export function createStore(): redux.Store<State> {
  return redux.createStore(reducer)
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function connect<T extends Function, P = {}>(
  stateToProps?: (state: State, props?: P) => any,
  dispatchToProps?: (dispatch: redux.Dispatch) => any
): (c: T) => typeof Component {
  return (c) => (infernoRedux.connect(stateToProps, dispatchToProps)(c) as unknown) as typeof Component
}
