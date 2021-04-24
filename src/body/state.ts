import { collectEntities, filterEntities, orbitable } from '../dynamics'
import { getPosition, getRoot, Location, Position } from '../dynamics/position'
import { distSquared } from '../geometry'
import { Specs } from '../ships/state'
import { Mutation, State, Storage } from '../state'

export interface Body {
  type: 'planet' | 'star' | 'moon' | 'gas-giant' | 'artificial' | 'belt'
  radius: number
  escapeVelocity?: number
}

export interface Resources {
  luminocity: number
  metals: number
  gases: number
  radiation: number
  magnetism: number
  water: number
}

export interface BodyState {
  bodies: Storage<Body>
  resources: Storage<Partial<Resources>>
}

const ship: Body = { type: 'artificial', radius: 0.00001 }
const station: Body = { type: 'artificial', radius: 0.0001 }

export const bodies: BodyState = {
  bodies: {
    sol: { type: 'star', radius: 2.3, escapeVelocity: 617.5 },
    mercury: { type: 'planet', radius: 0.008, escapeVelocity: 4.25 },
    venus: { type: 'planet', radius: 0.02, escapeVelocity: 10.36 },
    earth: { type: 'planet', radius: 0.021, escapeVelocity: 11.19 },
    moon: { type: 'moon', radius: 0.006, escapeVelocity: 2.38 },
    mars: { type: 'planet', radius: 0.011, escapeVelocity: 2.38 },
    asteroidBelt: { type: 'belt', radius: 1500, escapeVelocity: 0.0 },
    ceres: { type: 'planet', radius: 0.0015, escapeVelocity: 0.51 },
    phobos: { type: 'moon', radius: 0.00006, escapeVelocity: 0.2 },
    deimos: { type: 'moon', radius: 0.00006, escapeVelocity: 0.2 },
    jupiter: { type: 'gas-giant', radius: 0.23, escapeVelocity: 60.2 },
    ganymed: { type: 'moon', radius: 0.0087, escapeVelocity: 2.741 },
    callisto: { type: 'moon', radius: 0.008, escapeVelocity: 2.3 },
    io: { type: 'moon', radius: 0.006, escapeVelocity: 2.558 },
    europa: { type: 'moon', radius: 0.005, escapeVelocity: 2.025 },
    saturn: { type: 'gas-giant', radius: 0.19, escapeVelocity: 36.09 },
    saturnRings: { type: 'belt', radius: 0.3, escapeVelocity: 0.0 },
    titan: { type: 'moon', radius: 0.008, escapeVelocity: 2.3 },
    rhea: { type: 'moon', radius: 0.002, escapeVelocity: 0.7 },
    iapetus: { type: 'moon', radius: 0.002, escapeVelocity: 0.7 },
    dione: { type: 'moon', radius: 0.002, escapeVelocity: 0.7 },
    thethys: { type: 'moon', radius: 0.002, escapeVelocity: 0.7 },
    uranus: { type: 'gas-giant', radius: 0.084, escapeVelocity: 21.38 },
    titania: { type: 'moon', radius: 0.002, escapeVelocity: 0.7 },
    oberon: { type: 'moon', radius: 0.002, escapeVelocity: 0.7 },
    umbriel: { type: 'moon', radius: 0.002, escapeVelocity: 0.7 },
    ariel: { type: 'moon', radius: 0.002, escapeVelocity: 0.7 },
    neptune: { type: 'gas-giant', radius: 0.082, escapeVelocity: 23.56 },
    triton: { type: 'moon', radius: 0.004, escapeVelocity: 1.45 },
    pluto: { type: 'planet', radius: 0.004, escapeVelocity: 1.23 },
    charon: { type: 'moon', radius: 0.002, escapeVelocity: 0.7 },
    eris: { type: 'planet', radius: 0.004, escapeVelocity: 1.2 },
    dysnomia: { type: 'moon', radius: 0.002, escapeVelocity: 0.7 },
    solarPanel: station,
    fluxTube: station,
    advancedMaterials: station,
  },
  resources: {
    sol: {
      luminocity: 100000,
    },
    mercury: {
      metals: 1,
    },
    venus: {
      gases: 0.1,
    },
    jupiter: {
      luminocity: 0.2,
      radiation: 10,
      gases: 10,
      magnetism: 10,
    },
    mars: {
      metals: 1,
    },
    asteroidBelt: {
      metals: 3,
      gases: 2,
    },
    saturnRings: {
      metals: 1,
      gases: 2,
      water: 2,
    },
    ceres: {
      metals: 7,
    },
    saturn: {
      gases: 10,
    },
    neptune: {
      gases: 10,
    },
  },
}

export const addBodyForShip = (id: string, type: Specs['type']): Mutation<State> => (s) => {
  s.bodies.bodies[id] = type === 'station' ? station : ship
}

export const gravityAt = (state: State, id: string, position: Position): number => {
  const p1 = getPosition(state, id)
  const body = state.bodies.bodies[id]
  const vescape = body.escapeVelocity || 1
  // vescape = (2GM/R)^0.5 -> MG = (vescape^2*R)/(2)
  const mg = (vescape * vescape * body.radius) / 2
  return mg / distSquared(p1.x, p1.y, position.x, position.y)
}

export const getEscapeVelocity = (state: State, id: string): number | undefined => {
  const root = getRoot(state, id)
  return state.bodies.bodies[root].escapeVelocity
}

export const findStrongestParent = (s: State, location: Location): string | undefined => {
  const position = getPosition(s, location)
  const allOrderedByGravity = filterEntities(s, collectEntities(s, position.system), orbitable)
    .map((entity) => ({
      entity,
      gravity: gravityAt(s, entity, position),
    }))
    .sort((a, b) => (a.gravity < b.gravity ? 1 : -1))
  return allOrderedByGravity[0]?.entity
}
