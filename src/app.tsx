import { h } from 'preact'

import Map from './map'
import InformationPanel from './map/information-panel'

import { all, Provider as StateProvider, useApplicationState } from './state'
import { useEffect } from 'preact/hooks'
import { updateDynamics } from './dynamics/state'
import { updateMap } from './map/state'

export const App = () => {
  const [, mutate] = useApplicationState()
  useEffect(() => {
    const interval = setInterval(() => {
      mutate(all(updateDynamics, updateMap))
    }, 10)
    return () => clearInterval(interval)
  }, [mutate])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-9">
          <Map />
        </div>
        <div className="col-md-3">
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
