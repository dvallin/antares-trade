import { h, createContext, RenderableProps } from 'preact'
import { useContext, useReducer } from 'preact/hooks'
import { produce } from 'immer'

import { State, Mutate, Mutation } from './state'

import { starSystems } from './star-system/state'
import { map } from './map/state'
import { names } from './meta-data/state'
import { bodies } from './body/state'
import { ships } from './ships/state'
import { dynamics } from './dynamics/state'

export const initialState: State = {
  starSystems,
  map,
  names,
  bodies,
  dynamics,
  ships,
}

export const ApplicationState = createContext<[State, Mutate<State>]>([initialState, () => undefined])

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
    props.initialState ? props.initialState() : initialState
  )
  return <ApplicationState.Provider value={[state, mutate]}>{props.children}</ApplicationState.Provider>
}

export function useApplicationState(): [State, Mutate<State>] {
  return useContext(ApplicationState)
}
