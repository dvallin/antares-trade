import { Storage } from '../state'

export interface Name {
  name: string
}

export interface NameState {
  names: Storage<Name>
}

const name: (n: string) => Name = (name) => ({ name })

export const names: NameState = {
  names: {
    sol: name('Sol'),
    mercury: name('Mercury'),
    venus: name('Venus'),
    earth: name('Earth'),
    mars: name('Mars'),
    jupiter: name('Jupiter'),
    saturn: name('Saturn'),
    uranus: name('Uranus'),
    neptune: name('Neptune'),
    pluto: name('Pluto'),
    moon: name('Moon'),
    ship1: name('Ship 1'),
    ship2: name('Ship 2'),
    ship3: name('Ship 3'),
  },
}
