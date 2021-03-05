import { h, createContext, RenderableProps } from 'preact'
import { useContext, useReducer } from 'preact/hooks'
import { Draft, produce } from 'immer'

import { StarSystemState, starSystems } from './star-system/state'
import { MapState, map } from './map/state'
import { NameState, names } from './name/state'
import { BodyState, bodies } from './body/state'
import { ShipsState, ships } from './ships/state'
import { DynamicsState, dynamics } from './dynamics/state'

export interface Storage<C> {
  [entity: string]: C
}

export type Mutation<State> = (draft: Draft<State>) => void
export type Mutate<State> = (mutation: Mutation<State>) => void

export interface State {
  starSystems: StarSystemState
  map: MapState
  names: NameState
  bodies: BodyState
  dynamics: DynamicsState
  ships: ShipsState
}

export const initialState = (): State => ({
  starSystems,
  map,
  names,
  bodies,
  dynamics,
  ships,
})
export const ApplicationState = createContext<[State, Mutate<State>]>([initialState(), () => undefined])

export interface ProviderProps {
  onChange?: (state: State) => void
  initialState?: () => State
}
export function Provider<T>(props: RenderableProps<T> & ProviderProps) {
  const [state, mutate] = useReducer<State, Mutation<State>>(
    (state, mutation) => {
      const s = produce(state, (draft) => {
        mutation(draft)
      })
      props.onChange && props.onChange(s)
      return s
    },
    props.initialState ? props.initialState() : initialState()
  )
  return <ApplicationState.Provider value={[state, mutate]}>{props.children}</ApplicationState.Provider>
}

export function useApplicationState(): [State, Mutate<State>] {
  return useContext(ApplicationState)
}

export function all(...mutations: Mutation<State>[]): Mutation<State> {
  return (d) => {
    mutations.forEach((m) => m(d))
  }
}
