export interface Band {
  outerRadius: number
  innerRadius: number
}

export interface Orbit {
  radius: number
  phi: number
  speed: number
}

export type StarSystemPart = ({ sub?: StarSystem } & Orbit) | Band

export const isBand = (part: StarSystemPart): part is Band => 'innerRadius' in part

export interface StarSystem {
  [entity: string]: StarSystemPart
}

export function findAttachmentByParentInSystem(system: StarSystem, parent: string): { sub?: StarSystem } | undefined {
  for (const [key, part] of Object.entries(system)) {
    if (!isBand(part)) {
      if (key === parent) {
        return part
      }
      if (part.sub) {
        const attachment = findAttachmentByParentInSystem(part.sub, parent)
        if (attachment) {
          return attachment
        }
      }
    }
  }
}

export function findAttachmentByChildInSystem(system: StarSystem, id: string): StarSystem | undefined {
  if (Object.keys(system).find((k) => k === id)) {
    return system
  }
  for (const part of Object.values(system)) {
    if (!isBand(part) && part.sub) {
      const attachment = findAttachmentByChildInSystem(part.sub, id)
      if (attachment !== undefined) {
        return attachment
      }
    }
  }
}
