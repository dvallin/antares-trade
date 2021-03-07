import { h } from 'preact'

import { useApplicationState } from '../../application-state'

export interface Props {
  objects: string[]
  onSelect: (id: string) => void
}

export default (props: Props) => {
  const [state] = useApplicationState()
  return (
    <div class="list-group">
      {props.objects.map((id) => (
        <a
          href="#"
          class="list-group-item list-group-item-action"
          key={id}
          onClick={() => props.onSelect(id)}
          style={{ cursor: 'pointer' }}
        >
          {state.names.names[id]?.name || id}
        </a>
      ))}
    </div>
  )
}
