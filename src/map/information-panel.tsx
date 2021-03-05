import { h } from 'preact'

import { useApplicationState } from '../state'

import FocusedObject from './focused-object'
import { AllObjectsSelector } from './object-selector/selectors'
import { selectEntity } from './state'

export interface Props {
  isSelected: boolean
  onSelect: (id: string) => void
}

export default () => {
  const [state, mutate] = useApplicationState()
  return state.map.selected ? <FocusedObject /> : <AllObjectsSelector onSelect={(id) => mutate(selectEntity(id))} />
}
