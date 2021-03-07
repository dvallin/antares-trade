import { Fragment, h } from 'preact'

import { isNamedLocation, Location } from '../dynamics/state'
import { Name } from '../name/state'
import { toPolar } from '../polar'
import { useApplicationState } from '../application-state'

export interface Props {
  location: Location
  name?: Name
}

export default (props: Props) => {
  if (isNamedLocation(props.location)) {
    const [state] = useApplicationState()
    return <span>{state.names.names[props.location]?.name || 'unkown location'}</span>
  } else {
    const polar = toPolar(props.location.x, props.location.y)
    return (
      <Fragment>
        {props.location.system} (<span>{polar.radius.toFixed(0)}</span>ls,
        <span>{polar.phi.toFixed(2)}</span>θ)
      </Fragment>
    )
  }
}
