import { h } from 'preact'

import { useApplicationState } from '../application-state'
import { centerOfViewBox } from '../view-box'
import Location from './location'

export default () => {
  const [state] = useApplicationState()
  const center = centerOfViewBox(state.map.viewBox)
  const location = { system: state.starSystems.currentSystem, x: center[0], y: center[1] }
  return (
    <h1 className="text-center">
      <Location location={location} /> | {state.market.balances['player']} credits
    </h1>
  )
}
