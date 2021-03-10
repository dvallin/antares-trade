import { testMutation } from '../test-utils'
import { applyMovement, applyStarSystem, initDynamics, setMovement } from '../../src/dynamics/mutations'
import { initialState } from '../../src/application-state'
import produce from 'immer'
import { collectEntities, Position } from '../../src/dynamics'
import { docks } from '../../src/ships/state'
import { chain, State } from '../../src/state'
import { updateStarSystem, updateStarSystems } from '../../src/star-system/state'
import { dist } from '../../src/geometry'
import { getPosition } from '../../src/dynamics/getters'

const state = produce(initialState, (d) => {
  initDynamics(d)
  updateStarSystem(1, d.starSystems.systems[d.starSystems.currentSystem])
})

function getAsPosition(state: State, id: string): Position {
  return state.dynamics.positions[id] as Position
}

describe('dynamics mutations', () => {
  describe('setMovement', () => {
    it('sets movement in state', () => {
      const mutation = setMovement('some-id', 'some-location', 0.1)
      expect(testMutation(mutation)).toMatchObject({
        dynamics: { movements: { 'some-id': { to: 'some-location', v: 0.1, eta: 0 } } },
      })
    })
  })

  describe('applyStarSystem', () => {
    it('recursively applies star system changes', () => {
      const system = state.starSystems.systems[state.starSystems.currentSystem]
      const mutation = applyStarSystem(state.starSystems.currentSystem, system)
      const newState = testMutation(mutation, state)

      const sol = getAsPosition(newState, 'sol')
      const earth = getAsPosition(newState, 'earth')
      const moon = getAsPosition(newState, 'moon')
      expect(sol).toEqual(getPosition(state, 'sol'))
      expect(earth).not.toEqual(getPosition(state, 'earth'))
      expect(moon).not.toEqual(getPosition(state, 'moon'))
      expect(dist(sol.x, sol.y, earth.x, earth.y)).toBeCloseTo(498)
      expect(dist(earth.x, earth.y, moon.x, moon.y)).toBeCloseTo(1.3)
    })
  })

  describe('applyMovement', () => {
    const testShipState = produce(state, (s) => {
      s.dynamics.positions['testShip'] = { system: 'sol', x: 2, y: 0 }
      s.dynamics.positions['testStation'] = { system: 'sol', x: 1, y: 0 }
      s.dynamics.positions['fullStation'] = { system: 'sol', x: 1, y: 0 }
      s.ships.specs['testStation'] = { type: 'station', speed: 0.0, docks: docks(1) }
      s.ships.specs['fullStation'] = { type: 'station', speed: 0.0, docks: docks(0) }
    })

    it('applies movement', () => {
      const mutation = chain(setMovement('testShip', { system: 'sol', x: 0, y: 0 }, 1), applyMovement(1, 'testShip'))
      const newState = testMutation(mutation, testShipState)

      const oldPosition = getAsPosition(testShipState, 'testShip')
      const newPosition = getAsPosition(newState, 'testShip')
      expect(dist(oldPosition.x, oldPosition.y, newPosition.x, newPosition.y)).toBeCloseTo(1)
    })
    it('calculates eta', () => {
      const newState = testMutation(
        chain(setMovement('testShip', { system: 'sol', x: 0, y: 0 }, 1), applyMovement(1, 'testShip')),
        testShipState
      )
      expect(newState.dynamics.movements['testShip'].eta).toEqual(1)
    })
    it('detects location reached', () => {
      const target = { system: 'sol', x: 1.5, y: 0.3 }
      const mutation = chain(setMovement('testShip', target, 1), applyMovement(1, 'testShip'))
      const newState = testMutation(mutation, testShipState)

      expect(getAsPosition(newState, 'testShip')).toEqual(target)
      expect(newState.dynamics.movements['testShip']).toBeUndefined()
    })
    it('attaches orbit on position reached', () => {
      const target = { system: 'sol', x: 1.5, y: 0.3 }
      const mutation = chain(setMovement('testShip', target, 1), applyMovement(1, 'testShip'))
      const newState = testMutation(mutation, testShipState)

      expect(newState.starSystems.systems[newState.starSystems.currentSystem]).toEqual(
        expect.objectContaining({
          testShip: { phi: 0, radius: 2, speed: 0.00005 },
        })
      )
    })
    it('docks at location reached', () => {
      const mutation = chain(setMovement('testShip', 'testStation', 1), applyMovement(1, 'testShip'))
      const newState = testMutation(mutation, testShipState)

      expect(newState.ships.specs['testStation'].docks.docked).toContain('testShip')
    })
    it('does not dock at full location when reached', () => {
      const mutation = chain(setMovement('testShip', 'fullStation', 1), applyMovement(1, 'testShip'))
      const newState = testMutation(mutation, testShipState)

      expect(newState.ships.specs['fullStation'].docks.docked).not.toContain('testShip')
    })
  })

  describe('initDynamics', () => {
    it('does not initialize twice', () => {
      const newState = testMutation(chain(initDynamics, updateStarSystems), initialState)
      const anotherState = testMutation(initDynamics, newState)
      expect(newState.dynamics).toEqual(anotherState.dynamics)
    })

    it('adds star system objects to positions storage', () => {
      const newState = testMutation(initDynamics, initialState)
      expect(Object.keys(newState.dynamics.positions)).toEqual(
        expect.arrayContaining(collectEntities(initialState, initialState.starSystems.currentSystem))
      )
    })
  })
})
