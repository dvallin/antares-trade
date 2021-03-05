import { Draft } from 'immer'
import { Movement, setMovement } from '../dynamics/state'
import { all, Mutation, State } from '../state'

export interface ViewBox {
  x: number
  y: number
  w: number
  h: number
}

export interface MapState {
  selected: string | undefined
  focused: string | undefined
  state: 'move_to' | 'dock_at' | undefined
  subState: 'select_navigable_location' | 'select_dockable_location' | undefined
  viewBox: ViewBox
}

export const map: MapState = {
  selected: undefined,
  state: undefined,
  subState: undefined,
  focused: undefined,
  viewBox: {
    x: -1000,
    y: -1000,
    w: 2000,
    h: 2000,
  },
}

export const selectEntity = (id: string): Mutation<State> => (d) => {
  d.map.selected = id
  d.map.focused = id
}

export const finishedSelection = (): Mutation<State> => (d) => {
  delete d.map.state
  delete d.map.subState
  d.map.focused = d.map.selected
}

export const deselect = (): Mutation<State> => (d) => {
  delete d.map.selected
  delete d.map.focused
}
export const moveTo = (): Mutation<State> => (d) => {
  d.map.state = 'move_to'
  d.map.subState = 'select_navigable_location'
  delete d.map.focused
}
export const dockAt = (): Mutation<State> => (d) => {
  d.map.state = 'dock_at'
  d.map.subState = 'select_dockable_location'
  delete d.map.focused
}
export const setViewBox = (viewBox: ViewBox): Mutation<State> => (d) => {
  d.map.viewBox = viewBox
}

export const moveSelectedShip = (selected: string, to: Movement['to'], v: number): Mutation<State> =>
  all(finishedSelection(), setMovement(selected, to, v))

export const updateMap = (state: Draft<State>): void => {
  if (state.map.focused !== undefined) {
    const position = state.dynamics.positions[state.map.focused]
    if (position !== undefined) {
      state.map.viewBox = {
        ...state.map.viewBox,
        x: position.x - state.map.viewBox.w / 2,
        y: position.y - state.map.viewBox.h / 2,
      }
    }
  }
}
