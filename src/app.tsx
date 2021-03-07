import { h } from 'preact'

import Map from './map'
import InformationPanel from './map/information-panel'
import CurrentSystem from './map/current-system'

import { chain, Provider as StateProvider, useApplicationState } from './state'
import { useEffect } from 'preact/hooks'
import { updateStarSystems } from './star-system/state'
import { updateDynamics } from './dynamics/state'
import { updateMap } from './map/state'

import { moveShip } from './ships/state'

export const App = () => {
  const [, mutate] = useApplicationState()
  useEffect(() => {
    // initial state
    mutate(moveShip('ship2', 'earth', 0.7))

    const interval = setInterval(() => {
      mutate(chain(updateStarSystems, updateDynamics, updateMap))
    }, 10)
    return () => clearInterval(interval)
  }, [mutate])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <CurrentSystem />
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <InformationPanel />
        </div>
        <div className="col-md-9">
          <Map />
        </div>
      </div>
    </div>
  )
}

export default () => {
  return (
    <StateProvider>
      <App />
    </StateProvider>
  )
}
