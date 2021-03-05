import { h } from 'preact'

import { useApplicationState } from '../../state'

export interface Props {
  objects: string[]
  onSelect: (id: string) => void
}

export default (props: Props) => {
  const [state] = useApplicationState()
  return (
    <div>
      {props.objects.map((id) => (
        <div key={id} onClick={() => props.onSelect(id)} style={{ cursor: 'pointer' }}>
          {state.names.names[id]?.name || id}
        </div>
      ))}
    </div>
  )
}
