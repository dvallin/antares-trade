import { isNamedLocation, Location, Position } from '.'
import { State } from '../state'

export const getPosition = (state: State, location: Location): Position =>
  isNamedLocation(location) ? getPosition(state, state.dynamics.positions[location] || { system: 'unknown', x: 0, y: 0 }) : location
