import { Storage } from '../store'

export interface Body {
  radius: number
}

export interface BodyState {
  bodies: Storage<Body>
}

const star: Body = { radius: 2.3 }
const smallPlanet: Body = { radius: 0.008 }
const planet: Body = { radius: 0.008 }
const gasGiant: Body = { radius: 0.23 }
const moon: Body = { radius: 0.006 }
const ship: Body = { radius: 2 }

export const initialState = (): BodyState => ({
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
  },
})

export const bodies = (state: BodyState = initialState()): BodyState => {
  return state
}
