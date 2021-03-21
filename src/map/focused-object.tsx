import { Fragment, h } from 'preact'

import { moveSelectedShip, dockAtSelected, moveToSelected } from './state'
import { DockableLocationsSelector } from './object-selector/selectors'
import { Mutate, State } from '../state'
import { useApplicationState } from '../application-state'

import Location from './location'
import { printTime } from '../time'
import TradeRouteView from '../market/trade-route-view'
import { getLocation, isNamedLocation } from '../dynamics/position'
import Resources from './resources'
import EscapeVelocity from './escape-velocity'

const renderDockAt = (selected: string, state: State, mutate: Mutate<State>) => (
  <div>
    <DockableLocationsSelector
      onSelect={(id) => {
        mutate(moveSelectedShip(id, state.ships.specs[selected].speed))
      }}
    />
  </div>
)

const renderMoveTo = <div>select a navigable location from the map</div>

const renderDefault = (selected: string, state: State, mutate: Mutate<State>) => {
  const name = state.names.names[selected]
  const location = getLocation(state, selected)
  const movement = state.dynamics.movements[selected]
  const controllable = state.ships.controllable[selected]
  return (
    <div>
      <div className="row">{name ? <h2 className="col-sm">{name.name}</h2> : <Fragment />}</div>
      <div className="row">
        {location ? (
          <p class="lead col-sm">
            <Location location={location} />
          </p>
        ) : (
          <Fragment />
        )}
      </div>
      <div className="row">
        <div className="col">
          <EscapeVelocity id={isNamedLocation(location) ? location : selected} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Resources id={selected} />
        </div>
      </div>
      <div className="row">
        {movement ? (
          <p className="col-sm">
            traveling to <Location location={movement.to} /> ETA {printTime({ seconds: movement.eta })}
          </p>
        ) : (
          <Fragment />
        )}
      </div>
      <div className="row">
        {controllable?.by === 'player' ? (
          <div className="col-sm">
            <div>you own this ship</div>
            <div class="btn-group mr-2" role="group" aria-label="First group">
              <button class="btn btn-primary" onClick={() => mutate(moveToSelected())}>
                move to
              </button>
              <button class="btn btn-primary" onClick={() => mutate(dockAtSelected())}>
                dock at
              </button>
            </div>
            <TradeRouteView id={selected} />
          </div>
        ) : (
          <div className="col-sm">owned by {controllable?.by || 'noone'}</div>
        )}
      </div>
    </div>
  )
}

export default () => {
  const [state, mutate] = useApplicationState()
  const selected = state.map.selected
  if (selected) {
    switch (state.map.state) {
      case 'dock_at':
        return renderDockAt(selected, state, mutate)
      case 'move_to':
        return renderMoveTo
      default:
        return renderDefault(selected, state, mutate)
    }
  } else {
    return <span>Nothing selected</span>
  }
}
