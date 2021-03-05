import { Fragment, h } from 'preact'

import { Position, toPolar } from '../dynamics/state'
import { Name } from '../name/state'
import { useApplicationState } from '../state'

export interface Props {
  location: string | Position
  name?: Name
}

export default (props: Props) => {
  if (typeof props.location !== 'string') {
    const polar = toPolar(props.location, 0, 0)
    return (
      <Fragment>
        {props.location.system} (<span>{polar.radius.toFixed(1)}</span>ls,
        <span>{polar.phi.toFixed(2)}</span>θ)
      </Fragment>
    )
  } else {
    const [state] = useApplicationState()
    const name = typeof props.location === 'string' ? state.names.names[props.location] : undefined
    return <span>{name !== undefined ? name.name : 'unkown location'}</span>
  }
}
