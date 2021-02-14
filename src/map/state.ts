import { Draft, produce } from 'immer'
import { State } from '../store'

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

export const initialState = (): MapState => ({
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
})

export type MapAction =
  | { type: 'SELECT_ENTITY'; id: string }
  | { type: 'DESELECT_ENTITY' }
  | { type: 'MOVE_TO' }
  | { type: 'DOCK_AT' }
  | { type: 'SELECT_NAVIGABLE_LOCATION'; id: string; location: [number, number]; system: string }
  | { type: 'SELECT_DOCKABLE_LOCATION'; id: string; location: string }
  | { type: 'SET_VIEW_BOX'; viewBox: ViewBox }

export const map = (state: MapState = initialState(), action: MapAction): MapState => {
  return produce(state, (d) => {
    switch (action.type) {
      case 'SELECT_ENTITY': {
        d.selected = action.id
        d.focused = action.id
        break
      }
      case 'SET_VIEW_BOX': {
        d.viewBox = action.viewBox
        break
      }
      case 'DESELECT_ENTITY': {
        delete d.selected
        delete d.focused
        break
      }
      case 'MOVE_TO': {
        d.state = 'move_to'
        d.subState = 'select_navigable_location'
        delete d.focused
        break
      }
      case 'DOCK_AT': {
        d.state = 'dock_at'
        d.subState = 'select_dockable_location'
        delete d.focused
        break
      }
      case 'SELECT_DOCKABLE_LOCATION':
      case 'SELECT_NAVIGABLE_LOCATION': {
        delete d.state
        delete d.subState
        d.focused = d.selected
        break
      }
    }
  })
}

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
