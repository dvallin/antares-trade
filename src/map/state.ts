import { Draft } from 'immer'
import { getPosition, Movement } from '../dynamics/state'
import { moveShip } from '../ships/state'
import { chain, Mutation, State } from '../state'
import { focusViewBox, ViewBox } from '../view-box'

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
export const moveToSelected = (): Mutation<State> => (d) => {
  d.map.state = 'move_to'
  d.map.subState = 'select_navigable_location'
  delete d.map.focused
}
export const dockAtSelected = (): Mutation<State> => (d) => {
  d.map.state = 'dock_at'
  d.map.subState = 'select_dockable_location'
  delete d.map.focused
}
export const setViewBox = (viewBox: ViewBox): Mutation<State> => (d) => {
  d.map.viewBox = viewBox
}

export const moveSelectedShip = (to: Movement['to'], v: number): Mutation<State> =>
  chain((d) => {
    const selected = d.map.selected
    if (selected) {
      moveShip(selected, to, v)(d)
    }
  }, finishedSelection())

export const updateMap = (state: Draft<State>): void => {
  if (state.map.focused !== undefined) {
    const position = getPosition(state, state.map.focused)
    if (position !== undefined) {
      state.map.viewBox = focusViewBox(state.map.viewBox, position.x, position.y)
    }
  }
}
