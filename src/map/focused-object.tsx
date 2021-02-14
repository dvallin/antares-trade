import { Component } from 'inferno'
import { Name } from '../name/state'
import { Controllable, Movement, Position } from '../dynamics/state'
import { State, connect } from '../store'
import { MapState } from './state'
import Location from './location'

export interface Props {
  name: Name | undefined
  controllable: Controllable | undefined
  position: Position | undefined
  movement: Movement | undefined
  destination: string | undefined
  state: MapState['state']
  moveTo: () => void
  dockAt: () => void
  deselect: () => void
}

interface Time {
  seconds: number
  minutes: number
  hours: number
  days: number
}

function simplifyTime(time: Partial<Time>): Time {
  const t: Time = {
    seconds: time.seconds || 0,
    minutes: time.minutes || 0,
    hours: time.hours || 0,
    days: time.days || 0,
  }
  if (t.seconds >= 60) {
    t.minutes += t.seconds / 60
    t.seconds %= 60
  }
  if (t.minutes >= 60) {
    t.hours += time.hours / 60
    t.minutes %= 60
  }
  if (t.hours >= 24) {
    t.days += time.days / 24
    t.days %= 24
  }
  return t
}

function printTime(time: Partial<Time>): string {
  const t = simplifyTime(time)
  let result = ''
  if (t.days > 0) {
    result += t.days.toFixed(0) + 'd'
  }
  if (t.hours > 0) {
    result += t.hours.toFixed(0) + 'h'
  }
  if (t.minutes > 0) {
    result += t.minutes.toFixed(0) + 'm'
  }
  if (t.seconds > 0) {
    result += t.seconds.toFixed(0) + 's'
  }
  return result
}

export class FocusedObject extends Component<Props> {
  renderName(): JSX.Element {
    return this.props.name ? <div className="column">{this.props.name.name}</div> : <></>
  }

  renderDeselect(): JSX.Element {
    return (
      <div className="column is-narrow" onClick={() => this.props.deselect()} style={{ cursor: 'pointer' }}>
        {'<<'}
      </div>
    )
  }

  renderLocation(): JSX.Element {
    return this.props.position ? (
      <div className="column is-full">
        <Location location={this.props.position} />
      </div>
    ) : (
      <></>
    )
  }

  renderTravelInfo(): JSX.Element {
    return this.props.movement ? (
      <div className="column is-full">
        travelling to <Location location={this.props.movement.to} /> ETA {printTime({ seconds: this.props.movement.eta })}
      </div>
    ) : (
      <></>
    )
  }

  renderControls(): JSX.Element {
    return this.props.controllable !== undefined && this.props.controllable.by === 'player' ? (
      <div className="column is-full">
        <button onClick={() => this.props.moveTo()}>move to</button>
        <button onClick={() => this.props.dockAt()}>dock at</button>
      </div>
    ) : (
      <div className="column is-full">not controllable</div>
    )
  }

  renderDockableLocationsSelector(): JSX.Element {
    return <div>dockable locations</div>
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
          <div className="columns is-multiline">
            {this.renderDeselect()}
            {this.renderName()}
            {this.renderLocation()}
            {this.renderTravelInfo()}
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
    position: state.dynamics.positions[state.map.selected],
    movement: state.dynamics.movements[state.map.selected],
    state: state.map.state,
  }),
  (d) => ({
    moveTo: () => d({ type: 'MOVE_TO' }),
    dockAt: () => d({ type: 'DOCK_AT' }),
    deselect: () => d({ type: 'DESELECT_ENTITY' }),
  })
)(FocusedObject)
