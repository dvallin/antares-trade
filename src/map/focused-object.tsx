import { Fragment, h } from 'preact'

import { moveSelectedShip, deselect, dockAt, moveTo } from './state'
import { NearObjectsSelector } from './object-selector/selectors'
import { Mutate, State, useApplicationState } from '../state'

import Location from './location'
import { printTime } from '../time'

const renderDockAt = (selected: string, state: State, mutate: Mutate<State>) => (
  <div>
    <NearObjectsSelector
      onSelect={(id) => {
        mutate(moveSelectedShip(selected, id, state.ships.specs[selected].speed))
      }}
    />
  </div>
)

const renderMoveTo = <div>select a navigable location from the map</div>

const renderDefault = (selected: string, state: State, mutate: Mutate<State>) => {
  const name = state.names.names[selected]
  const position = state.dynamics.positions[selected]
  const movement = state.dynamics.movements[selected]
  const controllable = state.ships.controllable[selected]
  return (
    <div className="container">
      <div className="row">
        <h1 className="col-sm-auto" onClick={() => mutate(deselect())} style={{ cursor: 'pointer' }}>
          {'<<'}
        </h1>
        {name ? <h1 className="col-sm">{name.name}</h1> : <Fragment />}
      </div>
      <div className="row">
        {position ? (
          <p class="lead col-sm">
            <Location location={position} />
          </p>
        ) : (
          <Fragment />
        )}
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
        {controllable !== undefined && controllable.by === 'player' ? (
          <div className="col-sm">
            <div>you own this ship</div>
            <div class="btn-group mr-2" role="group" aria-label="First group">
              <button class="btn btn-primary" onClick={() => mutate(moveTo())}>
                move to
              </button>
              <button class="btn btn-primary" onClick={() => mutate(dockAt())}>
                dock at
              </button>
            </div>
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
