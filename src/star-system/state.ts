import { StarSystem } from '.'

export interface StarSystemState {
  currentSystem: string
  systems: {
    [id: string]: StarSystem
  }
}

const sol: StarSystem = {
  sol: {
    radius: 0,
    speed: 0,
  },
  mercury: {
    radius: 192,
    speed: 0.00005,
  },
  venus: {
    radius: 360,
    speed: 0.0001,
  },
  earth: {
    radius: 498,
    speed: 0.0001,
    sub: {
      moon: {
        radius: 1.3,
        speed: 0.001,
      },
    },
  },
  mars: {
    radius: 756,
    speed: 0.00005,
  },
  asteroidBelt1: {
    innerRadius: 850,
    outerRadius: 2200,
  },
  jupiter: {
    radius: 2592,
    speed: 0.00005,
  },
  saturn: {
    radius: 4680,
    speed: 0.00005,
  },
  uranus: {
    radius: 9720,
    speed: 0.00005,
  },
  neptune: {
    radius: 14760,
    speed: 0.00005,
  },
  pluto: {
    radius: 19800,
    speed: 0.00005,
  },
}

export const starSystems: StarSystemState = {
  currentSystem: 'sol',
  systems: { sol },
}
