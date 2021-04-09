import { testMutation } from '../test-utils'
import produce from 'immer'
import { docks } from '../../src/ships/state'
import { chain } from '../../src/state'
import { dist } from '../../src/geometry'
import { applyMovement, setMovement } from '../../src/dynamics/movement'
import { getAsPosition, initialStateWithDynamics as state } from '../test-state'
import { getCurrentStarSystem } from '../../src/star-system/state'
import { toPolar } from '../../src/polar'

describe('setMovement', () => {
  it('sets movement in state', () => {
    const mutation = setMovement('some-id', 'some-location', 0.1)
    expect(testMutation(mutation)).toMatchObject({
      dynamics: { movements: { 'some-id': { to: 'some-location', v: 0.1, eta: 0 } } },
    })
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

    const p = toPolar(1.5, 0.3)
    expect(getCurrentStarSystem(newState)['sol']).toEqual(
      expect.objectContaining({
        sub: { testShip: { phi: p.phi, radius: p.radius, speed: 0.00005 } },
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
