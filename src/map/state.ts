import { produce } from 'immer'

export interface MapState {
  selected: string | undefined
  state: 'move_to' | 'dock_at' | undefined
  subState: 'select_navigable_location' | 'select_dockable_location' | undefined
}

export const initialState = (): MapState => ({
  selected: undefined,
  state: undefined,
  subState: undefined,
})

export type MapAction =
  | { type: 'SELECT_ENTITY'; id: string }
  | { type: 'MOVE_TO' }
  | { type: 'DOCK_AT' }
  | { type: 'SELECT_NAVIGABLE_LOCATION'; id: string; location: [number, number]; system: string }
  | { type: 'SELECT_DOCKABLE_LOCATION'; id: string; location: string }

export const map = (state: MapState = initialState(), action: MapAction): MapState => {
  return produce(state, (d) => {
    switch (action.type) {
      case 'SELECT_ENTITY': {
        d.selected = action.id
        break
      }
      case 'MOVE_TO': {
        d.state = 'move_to'
        d.subState = 'select_navigable_location'
        break
      }
      case 'DOCK_AT': {
        d.state = 'dock_at'
        d.subState = 'select_dockable_location'
        break
      }
      case 'SELECT_DOCKABLE_LOCATION':
      case 'SELECT_NAVIGABLE_LOCATION': {
        delete d.state
        delete d.subState
        delete d.selected
        break
      }
    }
  })
}
