import { Storage } from '../state'

export interface Body {
  type: 'planet' | 'star' | 'moon' | 'gas-giant' | 'artificial'
  radius: number
}

export interface BodyState {
  bodies: Storage<Body>
}

const star: Body = { type: 'star', radius: 2.3 }
const smallPlanet: Body = { type: 'planet', radius: 0.008 }
const planet: Body = { type: 'planet', radius: 0.008 }
const gasGiant: Body = { type: 'gas-giant', radius: 0.23 }
const moon: Body = { type: 'moon', radius: 0.006 }
const ship: Body = { type: 'artificial', radius: 0.00001 }
const spaceStation: Body = { type: 'artificial', radius: 0.0001 }

export const bodies: BodyState = {
  bodies: {
    sol: star,
    mercury: smallPlanet,
    venus: planet,
    earth: planet,
    moon: moon,
    mars: planet,
    jupiter: gasGiant,
    saturn: gasGiant,
    uranus: gasGiant,
    neptune: gasGiant,
    pluto: smallPlanet,
    ship1: ship,
    ship2: ship,
    ship3: ship,
    spaceStation1: spaceStation,
  },
}
