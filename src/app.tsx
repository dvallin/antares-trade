import { h } from 'preact'

import Status from './map/status'
import MainView from './main-view'
import { AllObjectsSelector } from './map/object-selector/selectors'

import { Provider as StateProvider, useApplicationState } from './application-state'
import { useEffect } from 'preact/hooks'

import { chain } from './state'
import { updateMarkets } from './market/state'
import { updateStarSystems } from './star-system/state'
import { initDynamics, updateDynamics } from './dynamics/mutations'
import { selectEntity, updateMap } from './map/state'
import { moveShip } from './ships/state'

export const App = () => {
  const [, mutate] = useApplicationState()
  useEffect(() => {
    // initial state
    mutate(initDynamics)
    mutate(moveShip('ship2', 'spaceStation1', 0.7))
    mutate(moveShip('ship3', 'spaceStation1', 0.7))

    const interval = setInterval(() => {
      mutate(chain(updateStarSystems, updateDynamics, updateMap, updateMarkets))
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
        <div className="col-lg-3 ">
          <AllObjectsSelector onSelect={(id) => mutate(selectEntity(id))} />
        </div>
        <div className="col-lg-9">
          <MainView />
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
