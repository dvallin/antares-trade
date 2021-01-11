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
    antaresA: name('Antares A'),
    planet1: name('Planet 1'),
    planet2: name('Planet 2'),
    planet3: name('Planet 3'),
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
