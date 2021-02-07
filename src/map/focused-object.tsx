import { Component } from 'inferno'
import { Name } from '../name/state'
import { Controllable } from '../dynamics/state'
import { State, connect } from '../store'
import { MapState } from './state'

export interface Props {
  name: Name | undefined
  controllable: Controllable | undefined
  state: MapState['state']
  moveTo: () => void
  dockAt: () => void
}

export class FocusedObject extends Component<Props> {
  renderName(): JSX.Element {
    return this.props.name ? <div>{this.props.name.name}</div> : <></>
  }

  renderControls(): JSX.Element {
    return this.props.controllable !== undefined && this.props.controllable.by === 'player' ? (
      <div>
        <button onClick={() => this.props.moveTo()}>move to</button>
        <button onClick={() => this.props.dockAt()}>dock at</button>
      </div>
    ) : (
      <div>not controllable</div>
    )
  }

  renderDockableLocationsSelector(): JSX.Element {
    return <div>dockable lcoations</div>
  }

  renderMoveToInstructions(): JSX.Element {
    return <div>select a navigable location from the map</div>
  }

  render(): JSX.Element {
    switch (this.props.state) {
      case 'dock_at': {
        return <div>{this.renderDockableLocationsSelector()}</div>
      }
      case 'move_to': {
        return <div>{this.renderMoveToInstructions()}</div>
      }
      default:
        return (
          <div>
            {this.renderName()}
            {this.renderControls()}
          </div>
        )
    }
  }
}

export default connect(
  (state: State) => ({
    name: state.names.names[state.map.selected],
    controllable: state.dynamics.controllable[state.map.selected],
    state: state.map.state,
  }),
  (d) => ({
    moveTo: () => d({ type: 'MOVE_TO' }),
    dockAt: () => d({ type: 'DOCK_AT' }),
  })
)(FocusedObject)
