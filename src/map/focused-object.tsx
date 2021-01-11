import { Component } from 'inferno'
import { Name } from '../name/state'
import { State, connect } from '../store'

export interface Props {
  name: Name | undefined
}

export class FocusedObject extends Component<Props> {
  render(): JSX.Element {
    console.log(this.props.name)
    return this.props.name ? <div>{this.props.name.name}</div> : <></>
  }
}

export default connect((state: State) => {
  return { name: state.names.names[state.map.selected] }
})(FocusedObject)
