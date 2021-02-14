import { Component } from 'inferno'
import { collectEntities } from '../dynamics'
import { State, connect } from '../store'

export interface Props {
  objects: string[]
  select: (id: string) => void
}

export class ObjectList extends Component<Props> {
  render(): JSX.Element {
    return (
      <div>
        {this.props.objects.map((id) => (
          <div key={id} onClick={() => this.props.select(id)} style={{ cursor: 'pointer' }}>
            {id}
          </div>
        ))}
      </div>
    )
  }
}

export default connect(
  (state: State) => ({
    objects: collectEntities(state.dynamics, state.starSystems.currentSystem),
  }),
  (d) => ({
    select: (id: string) => d({ type: 'SELECT_ENTITY', id }),
  })
)(ObjectList)
