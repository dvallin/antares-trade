import location from '../map/location'
import { canDockAtLocation, dockAt } from '../ships/docks'
import { attachOrbit } from '../star-system/state'
import { Mutation, State } from '../state'
import { getPosition, isNamedLocation, Location, Position, setLocation } from './position'

export interface Movement {
  to: Location
  v: number
  eta: number
}
export type Trajectory = { id: string; from: Position; to: Position }

export const setMovement = (id: string, to: Movement['to'], v: Movement['v']): Mutation<State> => (d) => {
  d.dynamics.movements[id] = { to, v, eta: 0 }
}

export const applyMovement = (dt: number, id: string): Mutation<State> => (d) => {
  const movement = d.dynamics.movements[id]
  const to = movement.to
  const v = movement.v
  const p1 = getPosition(d, id)
  const p2 = getPosition(d, to)

  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const dist = Math.sqrt(dx * dx + dy * dy)

  const stepLength = v * dt
  if (dist <= stepLength) {
    positionObjectAt(id, to)(d)
    d.dynamics.positions[id] = to
    delete d.dynamics.movements[id]
  } else {
    d.dynamics.positions[id] = {
      system: p1.system,
      x: p1.x + (dx / dist) * stepLength,
      y: p1.y + (dy / dist) * stepLength,
    }
    movement.eta = (dist - stepLength) / v
  }
}

export const positionObjectAt = (id: string, location: Location): Mutation<State> => (s) => {
  setLocation(id, location)(s)
  if (!isNamedLocation(location)) {
    attachOrbit(id, 0.00005, undefined)(s)
  } else if (canDockAtLocation(s, id, location)) {
    dockAt(id, location)(s)
  }
}
