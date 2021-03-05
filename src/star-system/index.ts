export interface Band {
  outerRadius: number
  innerRadius: number
}

export interface Orbit {
  radius: number
  speed: number
}

export type StarSystemPart = ({ sub?: StarSystem } & Orbit) | Band

export interface StarSystem {
  [entity: string]: StarSystemPart
}

export function isBand(part: StarSystemPart): part is Band {
  return 'innerRadius' in part
}
