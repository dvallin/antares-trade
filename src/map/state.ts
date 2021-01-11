import { produce } from 'immer'

export interface MapState {
  selected: string
}

export const initialState = (): MapState => ({
  selected: '',
})

export type MapAction = { type: 'SELECT_ENTITY'; id: string }

export const map = (state: MapState = initialState(), action: MapAction): MapState => {
  return produce(state, (d) => {
    switch (action.type) {
      case 'SELECT_ENTITY': {
        d.selected = action.id
      }
    }
  })
}
