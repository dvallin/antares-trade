import { Component } from 'inferno'
import { Name } from '../name/state'
import { Storage } from '../state'
import { connect, State } from '../store'

export interface Props {
  entities: string[]
  names: Storage<Name>
  onSelect: (entity: string) => void
}

export class Location extends Component<Props> {
  render(): JSX.Element {
    return (
      <ul>
        {this.props.entities
          .map((entity) => ({ name: this.props.names[entity] || entity, entity }))
          .map(({ name, entity }) => (
            <li key={entity}>{name}</li>
          ))}
        <li>{}</li>
      </ul>
    )
  }
}

export default connect((state: State) => ({
  names: state.names.names,
}))(Location)
