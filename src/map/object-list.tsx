import { Component } from 'inferno'
import { collectEntities } from '../star-system'
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
  const system = state.starSystems.systems[state.starSystems.currentSystem]
  return {
    objects: collectEntities(system),
  }
})(ObjectList)
