import { Draft } from 'immer'
import { isNamedLocation, Movement } from '.'
import { fromPolar } from '../polar'
import { canDockAtLocation, dockAt } from '../ships/state'
import { isBand, StarSystem } from '../star-system'
import { attachOrbit } from '../star-system/state'
import { Mutation, State } from '../state'
import { getPosition } from './getters'

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
    if (!isNamedLocation(to)) {
      attachOrbit(id, 0.00005, undefined)(d)
    } else if (canDockAtLocation(d, id, to)) {
      dockAt(id, to)(d)
    }
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

export const applyStarSystem = (systemName: string, system: StarSystem, cx = 0, cy = 0): Mutation<State> => (d) => {
  Object.entries(system).map(([id, part]) => {
    if (!isBand(part)) {
      const [x, y] = fromPolar(part, cx, cy)

      if (part.sub) {
        applyStarSystem(systemName, part.sub, x, y)(d)
      }

      d.dynamics.positions[id] = { system: systemName, x, y }
    }
  })
}

export const initDynamics = (state: Draft<State>): void => {
  if (!state.dynamics.initialized) {
    Object.entries(state.starSystems.systems).forEach(([key, value]) => applyStarSystem(key, value)(state))
    state.dynamics.initialized = true
  }
}

export const updateDynamics = (dt: number): Mutation<State> => (d) => {
  Object.entries(d.starSystems.systems).forEach(([key, value]) => applyStarSystem(key, value)(d))
  Object.keys(d.dynamics.movements).forEach((id) => applyMovement(dt, id)(d))
}
