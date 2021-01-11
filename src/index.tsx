import { render, version } from 'inferno'
import { Provider } from 'inferno-redux'
import { createStore } from './store'
import './main.css'

import Map from './map/map'
import InformationPanel from './map/information-panel'

const store = createStore()
const App = () => (
  <Provider store={store}>
    <h1>{`Welcome to Inferno ${version} TSX ${version}`}</h1>
    <Map />
    <InformationPanel />
  </Provider>
)

function update() {
  store.dispatch({ type: 'TICK' })
  setTimeout(() => update(), 10)
}
update()

render(<App />, document.getElementById('app'))
