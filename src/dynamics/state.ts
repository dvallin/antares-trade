import { Draft } from 'immer'
import { toPolar, rotatePolar, fromPolar } from '../polar'
import { isBand, StarSystem } from '../star-system'
import { Mutation } from '../state'
import { State, Storage } from '../state'

export interface Movement {
  to: Location
  v: number
  eta: number
}

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
  positions: Storage<Position>
}

export const dynamics: DynamicsState = {
  lastUpdate: Date.now(),
  movements: {
    ship2: { to: 'earth', eta: 0, v: 0.7 },
  },
  positions: {
    sol: {
      system: 'sol',
      x: 0,
      y: 0,
    },
    mercury: {
      system: 'sol',
      x: 192,
      y: 0,
    },
    venus: {
      system: 'sol',
      x: 360,
      y: 0,
    },
    earth: {
      system: 'sol',
      x: 498,
      y: 0,
    },
    moon: {
      system: 'sol',
      x: 499.3,
      y: 0,
    },
    mars: {
      system: 'sol',
      x: 756,
      y: 0,
    },
    jupiter: {
      system: 'sol',
      x: 2592,
      y: 0,
    },
    saturn: {
      system: 'sol',
      x: 4680,
      y: 0,
    },
    uranus: {
      system: 'sol',
      x: 9720,
      y: 0,
    },
    neptune: {
      system: 'sol',
      x: 14760,
      y: 0,
    },
    pluto: {
      system: 'sol',
      x: 19800,
      y: 0,
    },
    ship1: {
      system: 'sol',
      x: 398,
      y: 0,
    },
    ship2: {
      system: 'sol',
      x: -2680,
      y: -20,
    },
    ship3: {
      system: 'sol',
      x: 3680,
      y: 0,
    },
  },
}

export const setMovement = (id: string, to: Movement['to'], v: Movement['v']): Mutation<State> => (d) => {
  d.dynamics.movements[id] = { to, v, eta: 0 }
}

export const translateChildren = (state: Draft<State>, system: StarSystem, dx = 0, dy = 0): void => {
  Object.entries(system).map(([id, part]) => {
    if (!isBand(part)) {
      const p = state.dynamics.positions[id]

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
      const p = state.dynamics.positions[id]

      const polar = toPolar(p.x, p.y, cx, cy)
      const [x, y] = fromPolar(rotatePolar(polar, part.speed), cx, cy)

      state.dynamics.positions[id] = { system: p.system, x, y }

      if (part.sub) {
        translateChildren(state, part.sub, x - p.x, y - p.y)
        applyStarSystem(state, dt, part.sub, p.x, p.y)
      }
    }
  })
}

export const applyMovement = (state: Draft<State>, dt: number, id: string, to: string | Position, v: number): void => {
  if (dt <= 0) {
    return
  }

  const p1 = state.dynamics.positions[id]
  const p2 = isNamedLocation(to) ? state.dynamics.positions[to] : to

  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const dist = Math.sqrt(dx * dx + dy * dy)

  const stepLength = v * dt
  if (dist < stepLength) {
    state.dynamics.positions[id] = p2
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
