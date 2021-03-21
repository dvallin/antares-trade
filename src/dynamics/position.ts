import { Mutation, State } from '../state'
import { fromPolar } from '../polar'
import { isBand, StarSystem } from '../star-system'

export interface Position {
  system: string
  x: number
  y: number
}

export type Location = string | Position
export const isNamedLocation = (l: Location): l is string => typeof l === 'string'

export const getPosition = (state: State, location: Location): Position =>
  isNamedLocation(location) ? getPosition(state, state.dynamics.positions[location] || { system: 'unknown', x: 0, y: 0 }) : location
export const getLocation = (state: State, id: string): Location => state.dynamics.positions[id]

export const applyStarSystem = (systemName: string, system: StarSystem, cx = 0, cy = 0): Mutation<State> => (d) => {
  Object.entries(system).map(([id, part]) => {
    if (!isBand(part)) {
      const [x, y] = fromPolar(part, cx, cy)

      if (part.sub) {
        applyStarSystem(systemName, part.sub, x, y)(d)
      }

      d.dynamics.positions[id] = { system: systemName, x, y }
    } else {
      d.dynamics.positions[id] = { system: systemName, x: cx, y: cy }
    }
  })
}
