import { h } from 'preact'

import ObjectSelector from '.'

import { collectEntities } from '../../dynamics'
import { useApplicationState } from '../../state'

export interface Props {
  onSelect: (id: string) => void
}

export const AllObjectsSelector = (props: Props) => {
  const [state] = useApplicationState()
  return <ObjectSelector onSelect={props.onSelect} objects={collectEntities(state.dynamics, state.starSystems.currentSystem)} />
}

export const NearObjectsSelector = (props: Props) => {
  const [state] = useApplicationState()
  return <ObjectSelector onSelect={props.onSelect} objects={collectEntities(state.dynamics, state.starSystems.currentSystem)} />
}
