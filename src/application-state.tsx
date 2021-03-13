import { h, createContext, RenderableProps } from 'preact'
import { useContext, useReducer } from 'preact/hooks'
import { produce } from 'immer'

import { State, Mutate, Mutation } from './state'

import { starSystems } from './star-system/state'
import { map } from './map/state'
import { market } from './market/state'
import { names } from './meta-data/state'
import { bodies } from './body/state'
import { ships } from './ships/state'
import { dynamics } from './dynamics/state'
import { memo } from 'preact/compat'

export const initialState: State = {
  lastUpdate: Date.now(),
  lastSave: Date.now(),
  starSystems,
  map,
  market,
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

export function connect<S, P = {}>(
  C: (p: P & S & { mutate: Mutate<State> }) => JSX.Element,
  select: (state: State, p: P) => S
): (p: P) => JSX.Element {
  return (p) => {
    const [state, mutate] = useApplicationState()
    return <C {...p} {...select(state, p)} mutate={mutate} />
  }
}

export function memoConnect<S, P>(
  C: (p: P & S) => JSX.Element,
  select: (state: State, p: P) => S,
  equals: (p1: P & S, p2: P & S) => boolean
): (p: P) => JSX.Element {
  return connect(memo(C, equals), select)
}
