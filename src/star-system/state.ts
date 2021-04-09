import { Draft } from 'immer'
import { isBand, StarSystem, findAttachmentByParentInSystem, findAttachmentByChildInSystem, Band } from '.'
import { getPosition, Position } from '../dynamics/position'
import { fromPolar, toPolar } from '../polar'
import { Mutation, State } from '../state'

export interface StarSystemState {
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
  asteroidBelt: {
    innerRadius: 850,
    outerRadius: 2200,
  },
  ceres: {
    radius: 1486,
    phi: 0,
    speed: 0.00005,
  },
  jupiter: {
    radius: 2592,
    phi: 0,
    speed: 0.00005,
    sub: {
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
      ganymed: {
        radius: 3.57,
        phi: 0,
        speed: 0.01,
      },
      callisto: {
        radius: 6.28,
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
      saturnRings: {
        innerRadius: 0.25,
        outerRadius: 0.4,
      },
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

export const findAttachmentByParent = (d: Draft<State>, system: string, parent: string): Draft<StarSystem> => {
  let attachment = d.starSystems.systems[system]
  const a = findAttachmentByParentInSystem(attachment, parent)
  if (a !== undefined) {
    if (a.sub === undefined) {
      a.sub = {}
    }
    attachment = a.sub
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

export const attachOrbit = (id: string, speed: number, parent: string): Mutation<State> => (d) => {
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

export const getOrbitPosition = (state: State, parent: string, radius: number, phi: number): Position => {
  const position = getPosition(state, parent)
  const [x, y] = fromPolar({ radius, phi }, position.x, position.y)
  return { x, y, system: position.system }
}

export const updateStarSystems = (dt: number): Mutation<State> => (d) => {
  Object.values(d.starSystems.systems).forEach((system) => updateStarSystem(dt, system))
}

export const getCurrentStarSystem = (state: State): StarSystem => {
  return state.starSystems.systems[state.starSystems.currentSystem]
}

export function getBandsFromSystem(state: State, starSystem: StarSystem): { id: string; band: Band }[] {
  const result: { id: string; band: Band }[] = []
  Object.entries(starSystem).forEach(([id, part]) => {
    if (isBand(part)) {
      result.push({ id, band: part })
    } else {
      if (part.sub) {
        result.concat(getBandsFromSystem(state, part.sub))
      }
    }
  })
  return result
}

export const getBands = (state: State, system: string): { id: string; band: Band }[] => {
  return getBandsFromSystem(state, state.starSystems.systems[system])
}
