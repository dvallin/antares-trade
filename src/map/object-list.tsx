import { Component } from 'inferno'
import { collectEntities } from '../dynamics'
import { State, connect } from '../store'

export interface Props {
  objects: string[]
}

export class ObjectList extends Component<Props> {
  render(): JSX.Element {
    return (
      <div>
        {this.props.objects.map((id) => (
          <div key={id}>{id}</div>
        ))}
      </div>
    )
  }
}

export default connect((state: State) => {
  return {
    objects: collectEntities(state.dynamics, state.starSystems.currentSystem),
  }
})(ObjectList)
