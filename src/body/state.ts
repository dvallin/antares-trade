import { Storage } from '../store'

export interface Body {
  radius: number
}

export interface BodyState {
  bodies: Storage<Body>
}

const star: Body = { radius: 8 }
const smallPlanet: Body = { radius: 1 }
const gasGiant: Body = { radius: 3 }
const moon: Body = { radius: 1 }
const ship: Body = { radius: 0.1 }

export const initialState = (): BodyState => ({
  bodies: {
    antaresA: star,
    planet1: smallPlanet,
    planet2: smallPlanet,
    planet3: gasGiant,
    moon1: moon,
    moon2: moon,
    ship1: ship,
    ship2: ship,
    ship3: ship,
  },
})

export const bodies = (state: BodyState = initialState()): BodyState => {
  return state
}
