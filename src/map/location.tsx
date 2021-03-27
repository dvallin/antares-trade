import { Fragment, h } from 'preact'

import { getName, Name } from '../meta-data/state'
import { toPolar } from '../polar'
import { useApplicationState } from '../application-state'
import { isNamedLocation, Location } from '../dynamics/position'

export interface Props {
  location: Location
  name?: Name
}

export default (props: Props) => {
  if (isNamedLocation(props.location)) {
    const [state] = useApplicationState()
    return <span>{getName(state, props.location, 'unkown location')}</span>
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
