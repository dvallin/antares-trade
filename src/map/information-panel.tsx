import { Component } from 'inferno'
import { State, connect } from '../store'

import FocusedObject from './focused-object'
import ObjectList from './object-list'

export interface Props {
  isSelected: boolean
}

export class InformationPanel extends Component<Props> {
  render(): JSX.Element {
    return this.props.isSelected ? <FocusedObject /> : <ObjectList />
  }
}

export default connect((state: State) => ({ isSelected: state.map.selected !== '' }))(InformationPanel)
