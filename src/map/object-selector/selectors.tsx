import { h } from 'preact'

import ObjectSelector from '.'

import { collectEntities, collectDockableLocations } from '../../dynamics'
import { useApplicationState } from '../../application-state'

export interface Props {
  onSelect: (id: string) => void
}

export const AllObjectsSelector = (props: Props) => {
  const [state] = useApplicationState()
  return <ObjectSelector onSelect={props.onSelect} objects={collectEntities(state, state.starSystems.currentSystem)} />
}

export const DockableLocationsSelector = (props: Props) => {
  const [state] = useApplicationState()
  const selected = state.map.selected || ''
  const entities = collectDockableLocations(state, selected)
  return <ObjectSelector onSelect={props.onSelect} objects={entities.filter((e) => e !== selected)} />
}
