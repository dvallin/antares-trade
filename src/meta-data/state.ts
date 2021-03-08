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
    moon: name('Moon (Earth)'),
    mars: name('Mars'),
    phobos: name('Phobos (Mars)'),
    deimos: name('Deimos (Mars)'),
    jupiter: name('Jupiter'),
    ganimed: name('Ganimed (Jupiter)'),
    callisto: name('Callisto (Jupiter)'),
    io: name('Io (Jupiter)'),
    europa: name('Europa (Jupiter)'),
    saturn: name('Saturn'),
    titan: name('Titan (Saturn)'),
    rhea: name('Rhea (Saturn)'),
    iapetus: name('Iapetus (Saturn)'),
    dione: name('Dione (Saturn)'),
    thethys: name('Thethys (Saturn)'),
    uranus: name('Uranus'),
    titania: name('Titania (Uranus)'),
    oberon: name('Oberon (Uranus)'),
    umbriel: name('Umbriel (Uranus)'),
    ariel: name('Ariel (Uranus)'),
    neptune: name('Neptune'),
    triton: name('Triton (Neptun)'),
    pluto: name('Pluto'),
    charon: name('Charon (Pluto)'),
    eris: name('Eris'),
    dysnomia: name('Dysnomia (Eris)'),
    ship1: name('Pirate Interceptor'),
    ship2: name('Frigate Mk1'),
    ship3: name('Heavy Freighter Mk2'),
    spaceStation1: name('Earth Trading Station'),
    heavyWeapons: name('Heavy Weapons Factory'),
  },
}
