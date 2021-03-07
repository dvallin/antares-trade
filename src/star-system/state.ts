import { Draft } from 'immer'
import { isBand, StarSystem } from '.'
import { getPosition } from '../dynamics/state'
import { toPolar } from '../polar'
import { Mutation, State } from '../state'

export interface StarSystemState {
  lastUpdate: number
  currentSystem: string
  systems: {
    [id: string]: StarSystem
  }
}

const sol: StarSystem = {
  sol: {
    radius: 0,
    phi: 0,
    speed: 0,
  },
  mercury: {
    radius: 192,
    phi: 0,
    speed: 0.00005,
  },
  venus: {
    radius: 360,
    phi: 0,
    speed: 0.0001,
  },
  earth: {
    radius: 498,
    phi: 0,
    speed: 0.0001,
    sub: {
      spaceStation1: {
        radius: 0.3,
        phi: 0,
        speed: 0.01,
      },
      moon: {
        radius: 1.3,
        phi: 0,
        speed: 0.001,
      },
    },
  },
  mars: {
    radius: 756,
    phi: 0,
    speed: 0.00005,
  },
  asteroidBelt1: {
    innerRadius: 850,
    outerRadius: 2200,
  },
  jupiter: {
    radius: 2592,
    phi: 0,
    speed: 0.00005,
  },
  saturn: {
    radius: 4680,
    phi: 0,
    speed: 0.00005,
  },
  uranus: {
    radius: 9720,
    phi: 0,
    speed: 0.00005,
  },
  neptune: {
    radius: 14760,
    phi: 0,
    speed: 0.00005,
  },
  pluto: {
    radius: 19800,
    phi: 0,
    speed: 0.00005,
  },
}

export const starSystems: StarSystemState = {
  lastUpdate: Date.now(),
  currentSystem: 'sol',
  systems: { sol },
}

export const updateStarSystem = (dt: number, system: Draft<StarSystem>): void => {
  Object.values(system).map((part) => {
    if (!isBand(part)) {
      if (part.sub) {
        updateStarSystem(dt, part.sub)
      }
      part.phi += part.speed * dt
    }
  })
}

export const findAttachmentByParentInSystem = (system: Draft<StarSystem>, parent: string): Draft<{ sub?: StarSystem }> | undefined => {
  for (const [key, part] of Object.entries(system)) {
    if (!isBand(part)) {
      if (key === parent) {
        return part
      }
      if (part.sub) {
        const attachment = findAttachmentByParentInSystem(part.sub, parent)
        if (attachment) {
          return attachment
        }
      }
    }
  }
}

export const findAttachmentByParent = (d: Draft<State>, system: string, parent: string | undefined): Draft<StarSystem> => {
  let attachment = d.starSystems.systems[system]
  if (parent !== undefined) {
    const a = findAttachmentByParentInSystem(attachment, parent)
    if (a !== undefined) {
      if (a.sub === undefined) {
        a.sub = {}
      }
      attachment = a.sub
    }
  }
  return attachment
}

export const findAttachmentByChildInSystem = (system: Draft<StarSystem>, id: string): Draft<StarSystem> | undefined => {
  if (Object.keys(system).find((k) => k === id)) {
    return system
  }
  for (const part of Object.values(system)) {
    if (!isBand(part) && part.sub) {
      const attachment = findAttachmentByChildInSystem(part.sub, id)
      if (attachment !== undefined) {
        return attachment
      }
    }
  }
}

export const findAttachmentByChild = (d: Draft<State>, system: string, id: string): Draft<StarSystem> | undefined => {
  return findAttachmentByChildInSystem(d.starSystems.systems[system], id)
}

export const detachOrbit = (id: string, system: string): Mutation<State> => (d) => {
  const attachment = findAttachmentByChild(d, system, id)
  if (attachment) {
    delete attachment[id]
  }
}

export const attachOrbit = (id: string, system: string, speed: number, parent: string | undefined): Mutation<State> => (d) => {
  const attachment = findAttachmentByParent(d, system, parent)
  const position = getPosition(d, id)
  const center = parent !== undefined ? getPosition(d, parent) : { system, x: 0, y: 0 }
  const polar = toPolar(position.x, position.y, center.x, center.y)
  attachment[id] = {
    radius: polar.radius,
    phi: polar.phi,
    speed,
  }
}

export const updateStarSystems = (state: Draft<State>): void => {
  const now = Date.now()
  const dt = (now - state.starSystems.lastUpdate) / 1000
  state.starSystems.lastUpdate = now

  Object.values(state.starSystems.systems).forEach((system) => updateStarSystem(dt, system))
}
