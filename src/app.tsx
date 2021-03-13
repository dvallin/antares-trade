import { h } from 'preact'

import Status from './map/status'
import MainView from './main-view'
import { AllObjectsSelector } from './map/object-selector/selectors'

import { Provider as StateProvider, useApplicationState } from './application-state'
import { useEffect } from 'preact/hooks'

import { init, update } from './state'
import { selectEntity } from './map/state'

export const App = () => {
  const [, mutate] = useApplicationState()
  useEffect(() => {
    mutate(init)
    const interval = setInterval(() => mutate(update), 30)
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
