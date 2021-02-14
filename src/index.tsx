import { render } from 'inferno'
import { Provider } from 'inferno-redux'
import { createStore } from './store'
import './main.css'

import Map from './map/map'
import InformationPanel from './map/information-panel'

const store = createStore()
const App = () => (
  <Provider store={store}>
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
  </Provider>
)

function update() {
  store.dispatch({ type: 'TICK' })
  setTimeout(() => update(), 10)
}
update()

render(<App />, document.getElementById('app'))
