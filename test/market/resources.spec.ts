import { initialStateWithDynamics as state } from '../test-state'
import { getResource, getResources } from '../../src/market/resources'
import produce from 'immer'
import { State } from '../../src/state'
import { getPosition } from '../../src/dynamics/position'

function addShip(state: State, id: string, x: number): State {
  return produce(state, (s) => {
    s.dynamics.positions[id] = { system: s.starSystems.currentSystem, x, y: 0 }
    s.bodies.bodies[id] = { type: 'artificial', radius: 0.001 }
  })
}
function addDockedShip(state: State, id: string, location: string): State {
  return produce(state, (s) => {
    s.dynamics.positions[id] = location
    s.bodies.bodies[id] = { type: 'artificial', radius: 0.001 }
  })
}
function addBelt(state: State, id: string, x: number): State {
  return produce(state, (s) => {
    s.dynamics.positions[id] = { system: s.starSystems.currentSystem, x, y: 0 }
    s.bodies.bodies[id] = { type: 'belt', radius: 10 }
  })
}
function addBand(state: State, id: string, x: number): State {
  return produce(state, (s) => {
    s.dynamics.positions[id] = { system: s.starSystems.currentSystem, x, y: 0 }
    s.starSystems.systems[s.starSystems.currentSystem][id] = {
      outerRadius: 100,
      innerRadius: 10,
    }
    s.bodies.resources[id] = {
      gases: 10,
      water: 10,
      metals: 10,
    }
  })
}

export const stateWithResources = produce(state, (s) => {
  s.bodies.resources = {}
  s.bodies.resources['sol'] = {
    luminosity: 100000,
  }
  s.bodies.resources['jupiter'] = {
    luminosity: 0.2,
    radiation: 10,
    gases: 10,
    magnetism: 10,
    water: 10,
    metals: 10,
  }
})

function validateBodyResource(resource: 'gases' | 'metals' | 'water', referenceEntity: string, referenceValue: number) {
  const referencePosition = getPosition(state, referenceEntity)
  describe(resource, () => {
    it('calculates for named object', () => {
      expect(getResource(stateWithResources, resource, referenceEntity)).toBeCloseTo(referenceValue)
    })
    it('calculates for free object', () => {
      const testState = addShip(stateWithResources, 'ship', referencePosition.x)
      expect(getResource(testState, resource, 'ship')).toBe(0)
    })
    it('calculates for free object in band', () => {
      const stateWithBand = addBand(stateWithResources, 'band', referencePosition.x)
      const testState = addShip(stateWithBand, 'ship', referencePosition.x + 10)
      expect(getResource(testState, resource, 'ship')).toBe(referenceValue)
    })
    it('calculates for docked object', () => {
      const testState = addDockedShip(stateWithResources, 'ship', referenceEntity)
      expect(getResource(testState, resource, 'ship')).toBe(referenceValue)
    })
  })
}

function validateFieldResource(resource: 'luminosity' | 'magnetism' | 'radiation', referenceEntity: string, referenceValue: number) {
  const referencePosition = getPosition(stateWithResources, referenceEntity)
  describe(resource, () => {
    it('calculates for named object', () => {
      expect(getResource(stateWithResources, resource, referenceEntity)).toBeCloseTo(referenceValue)
    })
    it('calculates for free object', () => {
      const testState = addShip(stateWithResources, 'ship', referencePosition.x)
      expect(getResource(testState, resource, 'ship')).toBeCloseTo(referenceValue)
    })
    it('calculates for docked object', () => {
      const testState = addDockedShip(stateWithResources, 'ship', referenceEntity)
      expect(getResource(testState, resource, 'ship')).toBeCloseTo(referenceValue)
    })
    it('falls of quadratically', () => {
      const testState = addShip(stateWithResources, 'ship', referencePosition.x + 10)
      expect(getResource(testState, resource, 'ship')).toBeCloseTo(referenceValue / (10 * 10))
    })
    it('calculates for belts', () => {
      const testState = addBelt(stateWithResources, 'belt', referencePosition.x)
      expect(getResource(testState, resource, 'belt')).toBeCloseTo(referenceValue / (10 * 10))
    })
  })
}

describe('getResource', () => {
  validateFieldResource('luminosity', 'sol', 100000)
  validateFieldResource('magnetism', 'jupiter', 10)
  validateFieldResource('radiation', 'jupiter', 10)
  validateBodyResource('water', 'jupiter', 10)
  validateBodyResource('gases', 'jupiter', 10)
  validateBodyResource('metals', 'jupiter', 10)
})

describe('getResources', () => {
  it('collects all resources', () => {
    expect(getResources(stateWithResources, 'sol').luminosity).toBeCloseTo(100000)
    expect(getResources(stateWithResources, 'jupiter')).toEqual(
      expect.objectContaining({
        gases: 10,
        magnetism: 10,
        metals: 10,
        radiation: 10,
        water: 10,
      })
    )
  })
})
