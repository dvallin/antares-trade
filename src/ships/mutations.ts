import { isNamedLocation, Movement } from '../dynamics'
import { setMovement } from '../dynamics/mutations'
import { detachOrbit } from '../star-system/state'
import { chain, Mutation, State } from '../state'

export const dockAt = (id: string, location: string): Mutation<State> => (d) => {
  const docks = d.ships.specs[location]?.docks
  if (docks) {
    docks.docked.push(id)
  }
}

export const undockShip = (id: string): Mutation<State> => (d) => {
  const p = d.dynamics.positions[id]
  if (isNamedLocation(p)) {
    const docks = d.ships.specs[p]?.docks
    if (docks) {
      docks.docked = docks.docked.filter((v) => v !== id)
    }
  }
}

export const moveShip = (ship: string, to: Movement['to'], v: number): Mutation<State> =>
  chain(undockShip(ship), detachOrbit(ship), setMovement(ship, to, v))
