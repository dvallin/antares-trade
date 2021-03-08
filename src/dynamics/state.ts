import { Draft } from 'immer'
import { fromPolar } from '../polar'
import { canDockAt, dockAt } from '../ships/state'
import { isBand, StarSystem } from '../star-system'
import { attachOrbit } from '../star-system/state'
import { Mutation } from '../state'
import { State, Storage } from '../state'

export interface Movement {
  to: Location
  v: number
  eta: number
}
export type Trajectory = { id: string; from: Position; to: Position }

export type Location = string | Position
export const isNamedLocation = (l: Location): l is string => typeof l === 'string'

export interface Position {
  system: string
  x: number
  y: number
}

export interface DynamicsState {
  lastUpdate: number
  movements: Storage<Movement>
  positions: Storage<Location>
}

export const dynamics: DynamicsState = {
  lastUpdate: Date.now(),
  movements: {},
  positions: {
    spaceStation1: {
      system: 'sol',
      x: 498.3,
      y: 0,
    },
    heavyWeapons: 'mars',
    ship1: {
      system: 'sol',
      x: 398,
      y: 0,
    },
    ship2: {
      system: 'sol',
      x: 756,
      y: 50,
    },
    ship3: {
      system: 'sol',
      x: 498,
      y: 20,
    },
  },
}

export const setMovement = (id: string, to: Movement['to'], v: Movement['v']): Mutation<State> => (d) => {
  d.dynamics.movements[id] = { to, v, eta: 0 }
}

export const translateChildren = (state: Draft<State>, system: StarSystem, dx = 0, dy = 0): void => {
  Object.entries(system).map(([id, part]) => {
    if (!isBand(part)) {
      const p = getPosition(state, id)

      const x = p.x + dx
      const y = p.y + dy
      state.dynamics.positions[id] = { system: p.system, x, y }

      if (part.sub) {
        translateChildren(state, system, dx, dy)
      }
    }
  })
}

export const applyStarSystem = (state: Draft<State>, dt: number, system: StarSystem, cx = 0, cy = 0): void => {
  Object.entries(system).map(([id, part]) => {
    if (!isBand(part)) {
      const p = getPosition(state, id)
      const [x, y] = fromPolar(part, cx, cy)

      if (part.sub) {
        applyStarSystem(state, dt, part.sub, p.x, p.y)
      }

      state.dynamics.positions[id] = { system: p.system, x, y }

      if (part.sub) {
        translateChildren(state, part.sub, x - p.x, y - p.y)
      }
    }
  })
}

export const getPosition = (state: State, location: Location): Position =>
  isNamedLocation(location) ? getPosition(state, state.dynamics.positions[location] || { system: 'unknown', x: 0, y: 0 }) : location

export const applyMovement = (state: Draft<State>, dt: number, id: string, to: string | Position, v: number): void => {
  if (dt <= 0) {
    return
  }

  const p1 = getPosition(state, id)
  const p2 = getPosition(state, to)

  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const dist = Math.sqrt(dx * dx + dy * dy)

  const stepLength = v * dt
  if (dist < stepLength) {
    if (!isNamedLocation(to)) {
      attachOrbit(id, 0.00005, undefined)(state)
    } else if (canDockAt(state, id, to)) {
      dockAt(to)
    }
    state.dynamics.positions[id] = to
    delete state.dynamics.movements[id]
  } else {
    state.dynamics.positions[id] = {
      system: p1.system,
      x: p1.x + (dx / dist) * stepLength,
      y: p1.y + (dy / dist) * stepLength,
    }
    state.dynamics.movements[id].eta = dist / v
  }
}

export const updateDynamics = (state: Draft<State>): void => {
  const now = Date.now()
  const dt = (now - state.dynamics.lastUpdate) / 1000
  state.dynamics.lastUpdate = now

  Object.entries(state.dynamics.movements).forEach(([id, movement]) => applyMovement(state, dt, id, movement.to, movement.v))
  Object.values(state.starSystems.systems).forEach((system) => applyStarSystem(state, dt, system))
}

export const initStarSystem = (state: Draft<State>, systemName: string, system: StarSystem, cx = 0, cy = 0): void => {
  Object.entries(system).map(([id, part]) => {
    if (!isBand(part)) {
      const [x, y] = fromPolar(part, cx, cy)

      if (part.sub) {
        initStarSystem(state, systemName, part.sub, x, y)
      }

      state.dynamics.positions[id] = { system: systemName, x, y }
    }
  })
}

export const initDynamics = (state: Draft<State>): void => {
  Object.entries(state.starSystems.systems).forEach(([key, value]) => initStarSystem(state, key, value))
}
