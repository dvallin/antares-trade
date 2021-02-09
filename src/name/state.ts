import { Storage } from '../store'

export interface Name {
  name: string
}

export interface NameState {
  names: Storage<Name>
}

const name: (n: string) => Name = (name) => ({ name })

export const initialState = (): NameState => ({
  names: {
    sol: name('Sol'),
    mercury: name('Mercury'),
    venus: name('Mercury'),
    earth: name('Earth'),
    mars: name('Mars'),
    jupiter: name('Jupiter'),
    saturn: name('Saturn'),
    uranus: name('Uranus'),
    neptune: name('Neptune'),
    pluto: name('Pluto'),
    moon1: name('Moon 1'),
    moon2: name('Moon 2'),
    ship1: name('Ship 1'),
    ship2: name('Ship 2'),
    ship3: name('Ship 3'),
  },
})

export const names = (state: NameState = initialState()): NameState => {
  return state
}
