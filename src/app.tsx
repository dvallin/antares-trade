import { h } from 'preact'

import Map from './map'
import InformationPanel from './map/information-panel'
import Status from './map/status'

import { Provider as StateProvider, useApplicationState } from './application-state'
import { useEffect } from 'preact/hooks'

import { chain } from './state'
import { updateStarSystems } from './star-system/state'
import { initDynamics, updateDynamics } from './dynamics/state'
import { updateMap } from './map/state'
import { moveShip } from './ships/state'

export const App = () => {
  const [, mutate] = useApplicationState()
  useEffect(() => {
    // initial state
    mutate(initDynamics)
    mutate(moveShip('ship2', 'spaceStation1', 0.7))
    mutate(moveShip('ship3', 'spaceStation1', 0.7))

    const interval = setInterval(() => {
      mutate(chain(updateStarSystems, updateDynamics, updateMap))
    }, 10)
    return () => clearInterval(interval)
  }, [mutate])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <Status />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-9 order-first order-lg-last">
          <Map />
        </div>
        <div className="col-lg-3 ">
          <InformationPanel />
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
