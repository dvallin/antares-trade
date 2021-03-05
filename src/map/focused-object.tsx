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
    <div className="columns is-multiline">
      <div className="column is-narrow" onClick={() => mutate(deselect())} style={{ cursor: 'pointer' }}>
        {'<<'}
      </div>
      {name ? <div className="column">{name.name}</div> : <Fragment />}
      {position ? (
        <div className="column is-full">
          <Location location={position} />
        </div>
      ) : (
        <Fragment />
      )}
      {movement ? (
        <div className="column is-full">
          traveling to <Location location={movement.to} /> ETA {printTime({ seconds: movement.eta })}
        </div>
      ) : (
        <Fragment />
      )}
      {controllable !== undefined && controllable.by === 'player' ? (
        <div className="column is-full">
          <button onClick={() => mutate(moveTo())}>move to</button>
          <button onClick={() => mutate(dockAt())}>dock at</button>
        </div>
      ) : (
        <div className="column is-full">not controllable</div>
      )}
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
