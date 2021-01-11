import { Band } from './band'
import { Orbit } from './orbit'

export type StarSystemPart = ({ sub?: StarSystem } & Orbit) | Band

export interface StarSystem {
  [entity: string]: StarSystemPart
}

export function isBand(part: StarSystemPart): part is Band {
  return part['innerRadius'] !== undefined
}

export function collectEntities(system: StarSystem): string[] {
  return Object.keys(system).concat(
    ...Object.values(system)
      .map((v) => !isBand(v) && v.sub)
      .filter((sub) => sub !== undefined)
      .map((v) => collectEntities(v))
  )
}
