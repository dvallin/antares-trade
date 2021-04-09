import { h } from 'preact'
import { useState } from 'preact/hooks'

import { useApplicationState } from '../../application-state'
import { Body } from '../../body/state'
import { filterEntities, relevant, ships, bodies, stations } from '../../dynamics'
import { getName } from '../../meta-data/state'
import { Specs } from '../../ships/state'
import { State } from '../../state'

export interface Props {
  objects: string[]
  onSelect: (id: string) => void
}

export function getSymbol(state: State, id: string): string {
  switch (state.bodies.bodies[id].type) {
    case 'artificial': {
      switch (state.ships.specs[id].type) {
        case 'fighter':
          return '≛'
        case 'freighter':
          return '⊔'
        case 'station':
          return '⌂'
      }
      break
    }
    case 'gas-giant':
      return '♄'
    case 'moon':
      return '☽︎'
    case 'planet':
      return '♁'
    case 'star':
      return '☉'
    case 'belt':
      return '∘'
  }
}

export type Filter = (Body['type'] | Specs['type'])[]
export default (props: Props) => {
  const [state] = useApplicationState()
  const [filter, setFilter] = useState<Filter>(relevant)
  return (
    <div class="list-group">
      <div class="btn-group flex-wrap" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-primary" data-testid="filterRelevant" onClick={() => setFilter(relevant)}>
          relevant
        </button>
        <button type="button" class="btn btn-primary" data-testid="filterShips" onClick={() => setFilter(ships)}>
          ships
        </button>
        <button type="button" class="btn btn-primary" data-testid="filterStations" onClick={() => setFilter(stations)}>
          stations
        </button>
        <button type="button" class="btn btn-primary" data-testid="filterBodies" onClick={() => setFilter(bodies)}>
          bodies
        </button>
      </div>
      {filterEntities(state, props.objects, filter)
        .sort((id) => (state.ships.controllable[id]?.by === 'player' ? 1 : 2))
        .map((id) => {
          const font = state.ships.controllable[id]?.by === 'player' ? 'font-weight-bold' : 'font-weight-normal'
          return (
            <a
              href="#"
              class={`list-group-item list-group-item-action ${font}`}
              key={id}
              onClick={() => props.onSelect(id)}
              style={{ cursor: 'pointer' }}
            >
              {getSymbol(state, id)} {getName(state, id)}
            </a>
          )
        })}
    </div>
  )
}
