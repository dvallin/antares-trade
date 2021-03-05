import { h } from 'preact'

import Map from './map/map'
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
    <div className="columns">
      <div className="column is-10">
        <Map />
      </div>
      <div className="column is-2">
        <div className="box">
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
