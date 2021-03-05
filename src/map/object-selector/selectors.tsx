import { h } from 'preact'

import ObjectSelector from '.'

import { collectEntities, collectNearEntities } from '../../dynamics'
import { useApplicationState } from '../../state'

export interface Props {
  onSelect: (id: string) => void
}

export const AllObjectsSelector = (props: Props) => {
  const [state] = useApplicationState()
  return <ObjectSelector onSelect={props.onSelect} objects={collectEntities(state, state.starSystems.currentSystem)} />
}

export const NearObjectsSelector = (props: Props) => {
  const [state] = useApplicationState()
  const selected = state.map.selected || ''
  const position = state.dynamics.positions[selected]
  const entities = position ? collectNearEntities(state, position) : []
  return <ObjectSelector onSelect={props.onSelect} objects={entities.filter((e) => e !== selected)} />
}
