import { Component } from 'inferno'
import { Position, toPolar } from '../dynamics/state'
import { Name } from '../name/state'
import { connect, State } from '../store'

export interface Props {
  location: string | Position
  name: Name | undefined
}

export class Location extends Component<Props> {
  render(): JSX.Element {
    if (typeof this.props.location !== 'string') {
      const polar = toPolar(this.props.location, 0, 0)
      return (
        <>
          {this.props.location.system} (
          <span style={{ display: 'inline-block', width: '40px', textAlign: 'right' }}>{polar.radius.toFixed(1)}</span>ls,
          <span style={{ display: 'inline-block', width: '40px', textAlign: 'right' }}>{polar.phi.toFixed(2)}</span>θ)
        </>
      )
    }
    return <span>{this.props.name !== undefined ? this.props.name.name : 'unkown location'}</span>
  }
}

export default connect((state: State, props: Props) => ({
  name: typeof props.location === 'string' ? state.names.names[props.location] : undefined,
}))(Location)
