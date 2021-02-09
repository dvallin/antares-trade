import produce, { Draft } from 'immer'
import { MapAction } from '../map/state'
import { isBand, StarSystem } from '../star-system'
import { State, Storage } from '../store'

export interface Controllable {
  by: string
}

export interface Movement {
  to: string | Position
  eta: number
}

export interface Position {
  system: string
  x: number
  y: number
}

export interface Polar {
  radius: number
  phi: number
}

export function toPolar(p: Position, cx: number, cy: number): Polar {
  const rx = p.x - cx
  const ry = p.y - cy
  const radius = Math.sqrt(rx * rx + ry * ry)
  const phi = Math.atan2(ry, rx)
  return { radius, phi }
}

export interface DynamicsState {
  lastUpdate: number
  controllable: Storage<Controllable>
  movements: Storage<Movement>
  positions: Storage<Position>
}

export const initialState = (): DynamicsState => ({
  lastUpdate: Date.now(),
  controllable: {
    ship1: { by: 'ai' },
    ship2: { by: 'player' },
    ship3: { by: 'player' },
  },
  movements: {
    ship2: { to: 'earth', eta: 0 },
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
})

export const dynamics = (state: DynamicsState = initialState(), action: MapAction): DynamicsState => {
  return produce(state, (d) => {
    switch (action.type) {
      case 'SELECT_NAVIGABLE_LOCATION': {
        d.movements[action.id] = {
          to: {
            system: action.system,
            x: action.location[0],
            y: action.location[1],
          },
          eta: 0,
        }
        break
      }
      case 'SELECT_DOCKABLE_LOCATION': {
        d.movements[action.id] = {
          to: action.location,
          eta: 0,
        }
        break
      }
    }
  })
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

      const { radius, phi } = toPolar(p, cx, cy)
      const phi2 = phi + part.speed

      const x = radius * Math.cos(phi2) + cx
      const y = radius * Math.sin(phi2) + cy
      state.dynamics.positions[id] = { system: p.system, x, y }

      if (part.sub) {
        translateChildren(state, part.sub, x - p.x, y - p.y)
        applyStarSystem(state, dt, part.sub, p.x, p.y)
      }
    }
  })
}

export const applyMovement = (state: Draft<State>, dt: number, id: string, to: string | Position): void => {
  if (dt <= 0) {
    return
  }

  const v = 1

  const p1 = state.dynamics.positions[id]
  const p2 = typeof to === 'string' ? state.dynamics.positions[to] : to

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

export const updateSystem = (state: Draft<State>): void => {
  const now = Date.now()
  const dt = (now - state.dynamics.lastUpdate) / 1000
  state.dynamics.lastUpdate = now

  Object.entries(state.dynamics.movements).forEach(([id, { to }]) => applyMovement(state, dt, id, to))
  Object.values(state.starSystems.systems).forEach((system) => applyStarSystem(state, dt, system))
}
