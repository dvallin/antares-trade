import produce from 'immer'
import { Resources } from '../body/state'
import { collectEntities } from '../dynamics'
import { getLocation, getPosition, isNamedLocation } from '../dynamics/position'
import { distSquared } from '../geometry'
import { getBands } from '../star-system/state'
import { State } from '../state'

export function getResources(state: State, id: string): Resources {
  return {
    luminocity: getResource(state, 'luminocity', id),
    magnetism: getResource(state, 'magnetism', id),
    radiation: getResource(state, 'radiation', id),
    metals: getResource(state, 'metals', id),
    gases: getResource(state, 'gases', id),
    water: getResource(state, 'water', id),
  }
}

export function getResource(state: State, resource: keyof Resources, id: string): number {
  const location = getLocation(state, id)
  if (isNamedLocation(location)) {
    return getResource(state, resource, location)
  }

  switch (resource) {
    case 'metals':
    case 'gases':
    case 'water': {
      const selfResource = state.bodies.resources[id]?.[resource] || 0
      const position = getPosition(state, id)
      const bands = getBands(state, position.system)
      const bandResource = bands
        .filter(({ id, band }) => {
          const center = getPosition(state, id)
          const d = distSquared(position.x, position.y, center.x, center.y)
          return band.innerRadius * band.innerRadius <= d && band.outerRadius * band.outerRadius >= d
        })
        .map(({ id }) => state.bodies.resources[id]?.[resource] || 0)
        .reduce((a, b) => a + b, 0)
      return selfResource + bandResource
    }
    case 'luminocity':
    case 'magnetism':
    case 'radiation': {
      let position = getPosition(state, id)
      const body = state.bodies.bodies[id]
      if (body.type === 'belt') {
        position = produce(position, (p) => {
          p.x += body.radius
        })
      }

      const entities = collectEntities(state, position.system)
      return entities
        .filter((id) => state.bodies.resources[id]?.[resource] !== undefined)
        .map((id) => {
          const amount = state.bodies.resources[id][resource] || 0
          const resourcePosition = getPosition(state, id)
          const d = distSquared(position.x, position.y, resourcePosition.x, resourcePosition.y)
          return d < 1 ? amount : amount / d
        })
        .reduce((a, b) => a + b, 0)
    }
  }
}
