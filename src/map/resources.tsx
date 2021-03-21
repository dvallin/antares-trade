import { h } from 'preact'

import { useApplicationState } from '../application-state'
import { Resources } from '../body/state'
import { getResources } from '../market/resources'

export interface Props {
  id: string
}

export default (props: Props) => {
  const [state] = useApplicationState()
  const resources = getResources(state, props.id)
  return (
    <div class="d-flex flex-row">
      {Object.keys(resources).map((key) => {
        const amount = resources[key as keyof Resources]
        const color = amount >= 1 ? 'text-success' : amount > 0.1 ? 'text-warning' : ''
        return (
          <div class="pr-2" key={key}>
            {key}: <span class={color}>{resources[key as keyof Resources].toFixed(2)}</span>
          </div>
        )
      })}
    </div>
  )
}
