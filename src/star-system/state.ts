import { Draft } from 'immer'
import { isBand, StarSystem, findAttachmentByParentInSystem, findAttachmentByChildInSystem } from '.'
import { getPosition } from '../dynamics/getters'
import { toPolar } from '../polar'
import { Mutation, State, withDeltaTime } from '../state'

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
    sub: {
      phobos: {
        radius: 0.031,
        phi: 0,
        speed: 0.01,
      },
      deimos: {
        radius: 0.078,
        phi: 0,
        speed: 0.001,
      },
    },
  },
  asteroidBelt1: {
    innerRadius: 850,
    outerRadius: 2200,
  },
  jupiter: {
    radius: 2592,
    phi: 0,
    speed: 0.00005,
    sub: {
      ganimed: {
        radius: 3.57,
        phi: 0,
        speed: 0.01,
      },
      callisto: {
        radius: 6.28,
        phi: 0,
        speed: 0.01,
      },
      io: {
        radius: 1.47,
        phi: 0,
        speed: 0.01,
      },
      europa: {
        radius: 2.25,
        phi: 0,
        speed: 0.01,
      },
    },
  },
  saturn: {
    radius: 4680,
    phi: 0,
    speed: 0.00005,
    sub: {
      titan: {
        radius: 4.08,
        phi: 0,
        speed: 0.01,
      },
      rhea: {
        radius: 1.75,
        phi: 0,
        speed: 0.01,
      },
      iapetus: {
        radius: 11.87,
        phi: 0,
        speed: 0.01,
      },
      dione: {
        radius: 1.25,
        phi: 0,
        speed: 0.01,
      },
      thethys: {
        radius: 0.98,
        phi: 0,
        speed: 0.01,
      },
    },
  },
  uranus: {
    radius: 9720,
    phi: 0,
    speed: 0.00005,
    sub: {
      titania: {
        radius: 1.45,
        phi: 0,
        speed: 0.01,
      },
      oberon: {
        radius: 1.94,
        phi: 0,
        speed: 0.01,
      },
      umbriel: {
        radius: 0.88,
        phi: 0,
        speed: 0.01,
      },
      ariel: {
        radius: 0.63,
        phi: 0,
        speed: 0.01,
      },
    },
  },
  neptune: {
    radius: 14760,
    phi: 0,
    speed: 0.00005,
    sub: {
      triton: {
        radius: 1.18,
        phi: 0,
        speed: 0.01,
      },
    },
  },
  pluto: {
    radius: 19800,
    phi: 0,
    speed: 0.00005,
    sub: {
      charon: {
        radius: 0.06,
        phi: 0,
        speed: 0.01,
      },
    },
  },
  eris: {
    radius: 48601,
    phi: 0,
    speed: 0.00005,
    sub: {
      dysnomia: {
        radius: 0.12,
        phi: 0,
        speed: 0.01,
      },
    },
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

export const findAttachmentByChild = (d: Draft<State>, system: string, id: string): Draft<StarSystem> | undefined => {
  return findAttachmentByChildInSystem(d.starSystems.systems[system], id)
}

export const detachOrbit = (id: string): Mutation<State> => (d) => {
  const position = getPosition(d, id)
  const attachment = findAttachmentByChild(d, position.system, id)
  if (attachment) {
    delete attachment[id]
  }
}

export const attachOrbit = (id: string, speed: number, parent: string | undefined): Mutation<State> => (d) => {
  const position = getPosition(d, id)
  const attachment = findAttachmentByParent(d, position.system, parent)
  const center = parent !== undefined ? getPosition(d, parent) : { system: position.system, x: 0, y: 0 }
  const polar = toPolar(position.x, position.y, center.x, center.y)
  attachment[id] = {
    radius: polar.radius,
    phi: polar.phi,
    speed,
  }
}

export const updateStarSystems = (state: Draft<State>): void => {
  withDeltaTime(state.starSystems, (dt) => {
    Object.values(state.starSystems.systems).forEach((system) => updateStarSystem(dt, system))
  })
}
