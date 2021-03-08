import { Storage } from '../state'

export interface Body {
  type: 'planet' | 'star' | 'moon' | 'gas-giant' | 'artificial'
  radius: number
}

export interface BodyState {
  bodies: Storage<Body>
}

const star: Body = { type: 'star', radius: 2.3 }
const ship: Body = { type: 'artificial', radius: 0.00001 }
const spaceStation: Body = { type: 'artificial', radius: 0.0001 }
const planetStation: Body = { type: 'artificial', radius: 0.0001 }

export const bodies: BodyState = {
  bodies: {
    sol: star,
    mercury: { type: 'planet', radius: 0.008 },
    venus: { type: 'planet', radius: 0.02 },
    earth: { type: 'planet', radius: 0.021 },
    moon: { type: 'moon', radius: 0.006 },
    mars: { type: 'planet', radius: 0.011 },
    phobos: { type: 'moon', radius: 0.00006 },
    deimos: { type: 'moon', radius: 0.00006 },
    jupiter: { type: 'gas-giant', radius: 0.23 },
    ganimed: { type: 'moon', radius: 0.0087 },
    callisto: { type: 'moon', radius: 0.008 },
    io: { type: 'moon', radius: 0.006 },
    europa: { type: 'moon', radius: 0.005 },
    saturn: { type: 'gas-giant', radius: 0.19 },
    titan: { type: 'moon', radius: 0.008 },
    rhea: { type: 'moon', radius: 0.002 },
    iapetus: { type: 'moon', radius: 0.002 },
    dione: { type: 'moon', radius: 0.002 },
    thethys: { type: 'moon', radius: 0.002 },
    uranus: { type: 'gas-giant', radius: 0.084 },
    titania: { type: 'moon', radius: 0.002 },
    oberon: { type: 'moon', radius: 0.002 },
    umbriel: { type: 'moon', radius: 0.002 },
    ariel: { type: 'moon', radius: 0.002 },
    neptune: { type: 'gas-giant', radius: 0.082 },
    triton: { type: 'moon', radius: 0.004 },
    pluto: { type: 'planet', radius: 0.004 },
    charon: { type: 'moon', radius: 0.002 },
    eris: { type: 'planet', radius: 0.004 },
    dysnomia: { type: 'moon', radius: 0.002 },
    ship1: ship,
    ship2: ship,
    ship3: ship,
    spaceStation1: spaceStation,
    heavyWeapons: planetStation,
  },
}
