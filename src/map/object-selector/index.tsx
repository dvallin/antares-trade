import { h } from 'preact'
import { useState } from 'preact/hooks'

import { useApplicationState } from '../../application-state'
import { Body } from '../../body/state'
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
  }
}

export default (props: Props) => {
  const [state] = useApplicationState()
  const [filter, setFilter] = useState<(Body['type'] | Specs['type'])[]>(['fighter', 'freighter', 'station'])
  return (
    <div class="list-group">
      <div class="btn-group flex-wrap" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-primary" onClick={() => setFilter(['fighter', 'freighter', 'station'])}>
          relevant
        </button>
        <button type="button" class="btn btn-primary" onClick={() => setFilter(['fighter', 'freighter'])}>
          ships
        </button>
        <button type="button" class="btn btn-primary" onClick={() => setFilter(['station'])}>
          stations
        </button>
        <button type="button" class="btn btn-primary" onClick={() => setFilter(['star', 'gas-giant', 'moon', 'planet'])}>
          bodies
        </button>
      </div>
      {props.objects
        .filter(
          (id) => filter.length === 0 || filter.includes(state.bodies.bodies[id].type) || filter.includes(state.ships.specs[id]?.type)
        )
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
              {getSymbol(state, id)} {state.names.names[id]?.name || id}
            </a>
          )
        })}
    </div>
  )
}
