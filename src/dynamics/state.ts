import { Draft } from 'immer'
import { isBand, StarSystem } from '../star-system'
import { State, Storage } from '../store'

export interface Controlable {
  by: string
}

export interface Movement {
  to: string
}

export interface Position {
  system: string
  x: number
  y: number
}

export interface DynamicsState {
  lastUpdate: number
  controlable: Storage<Controlable>
  movements: Storage<Movement>
  positions: Storage<Position>
}

export const initialState = (): DynamicsState => ({
  lastUpdate: Date.now(),
  controlable: {
    ship1: { by: 'ai' },
    ship2: { by: 'player' },
    ship3: { by: 'player' },
  },
  movements: {
    ship2: { to: 'planet3' },
  },
  positions: {
    antaresA: {
      system: 'antares',
      x: 0,
      y: 0,
    },
    planet1: {
      system: 'antares',
      x: 40,
      y: 0,
    },
    planet2: {
      system: 'antares',
      x: 30,
      y: 0,
    },
    planet3: {
      system: 'antares',
      x: 80,
      y: 0,
    },
    moon1: {
      system: 'antares',
      x: 35,
      y: 0,
    },
    moon2: {
      system: 'antares',
      x: 85,
      y: 0,
    },
    ship1: {
      system: 'antares',
      x: 65,
      y: 0,
    },
    ship2: {
      system: 'antares',
      x: 34,
      y: 0,
    },
    ship3: {
      system: 'antares',
      x: 86,
      y: 0,
    },
  },
})

export const dynamics = (state: DynamicsState = initialState()): DynamicsState => {
  return state
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

      let rx = p.x - cx
      let ry = p.y - cy
      const radius = Math.sqrt(rx * rx + ry * ry)
      const phi = Math.atan2(ry, rx) + part.speed

      const x = radius * Math.cos(phi) + cx
      const y = radius * Math.sin(phi) + cy
      state.dynamics.positions[id] = { system: p.system, x, y }

      if (part.sub) {
        translateChildren(state, part.sub, x - p.x, y - p.y)
        applyStarSystem(state, dt, part.sub, p.x, p.y)
      }
    }
  })
}

export const applyMovement = (state: Draft<State>, dt: number, id: string, to: string): void => {
  const p1 = state.dynamics.positions[id]
  const p2 = state.dynamics.positions[to]

  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const dist = Math.sqrt(dx * dx + dy * dy)

  const stepLength = 0.2 * dt
  if (dist < stepLength || dt <= 0) {
    state.dynamics.positions[id] = p2
    delete state.dynamics.movements[id]
  } else {
    state.dynamics.positions[id] = {
      system: p1.system,
      x: p1.x + (dx / dist) * stepLength,
      y: p1.y + (dy / dist) * stepLength,
    }
  }
}

export const updateSystem = (state: Draft<State>): void => {
  const now = Date.now()
  const dt = (now - state.dynamics.lastUpdate) / 1000
  state.dynamics.lastUpdate = now

  Object.entries(state.dynamics.movements).forEach(([id, { to }]) => applyMovement(state, dt, id, to))
  Object.values(state.starSystems.systems).forEach((system) => applyStarSystem(state, dt, system))
}
