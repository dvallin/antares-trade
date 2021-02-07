import { StarSystem } from 'star-system'

export interface StarSystemState {
  currentSystem: string
  systems: {
    [id: string]: StarSystem
  }
}

const antares: StarSystem = {
  antaresA: {
    radius: 0,
    speed: 0,
  },
  planet1: {
    radius: 40,
    speed: 0.00005,
  },
  planet2: {
    radius: 30,
    speed: 0.0001,
    sub: {
      moon1: {
        radius: 5,
        speed: 0.001,
      },
    },
  },
  planet3: {
    radius: 80,
    speed: 0.00005,
    sub: {
      moon2: {
        radius: 5,
        speed: 0.0001,
      },
    },
  },
  asteroidBelt1: {
    innerRadius: 50,
    outerRadius: 60,
  },
}

export const initialState = (): StarSystemState => ({
  currentSystem: 'antares',
  systems: { antares },
})

export const starSystems = (state: StarSystemState = initialState()): StarSystemState => {
  return state
}
