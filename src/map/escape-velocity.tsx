import { h } from 'preact'

import { useApplicationState } from '../application-state'

export interface Props {
  id: string
}

export default (props: Props) => {
  const [state] = useApplicationState()
  const v = state.bodies.bodies[props.id]?.escapeVelocity || 0
  const color = v >= 25 ? 'text-danger' : v > 10 ? 'text-warning' : ''
  return (
    <div>
      escape velocity: <span class={color}>{v}</span>
    </div>
  )
}
