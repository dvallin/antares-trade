import produce from 'immer'
import { initialState } from '../../src/application-state'
import { addBodyForShip, findStrongestParent, gravityAt } from '../../src/body/state'
import { getPosition } from '../../src/dynamics/position'
import { initialStateWithDynamics } from '../test-state'

describe('addBodyForShip', () => {
  it('adds a station', () => {
    const state = produce(initialState, addBodyForShip('id', 'station'))
    expect(state.bodies.bodies['id']).toEqual({ radius: 0.0001, type: 'artificial' })
  })
  it('adds a station', () => {
    const state = produce(initialState, addBodyForShip('id', 'freighter'))
    expect(state.bodies.bodies['id']).toEqual({ radius: 0.00001, type: 'artificial' })
  })
})

describe('gravityAt', () => {
  const state = initialStateWithDynamics

  it('calculates gravity inside self to be infinity', () => {
    const gravity = gravityAt(state, 'sol', getPosition(state, 'sol'))
    expect(gravity).toEqual(Infinity)
  })
  it('calculates gravity on surface', () => {
    const gravity = gravityAt(
      state,
      'sol',
      produce(getPosition(state, 'sol'), (p) => {
        p.x += state.bodies.bodies['sol'].radius
      })
    )
    expect(gravity).toBeCloseTo(82892.663)
  })
})

describe('findStrongestParent', () => {
  const state = initialStateWithDynamics

  it('finds self if self', () => {
    const parent = findStrongestParent(state, getPosition(state, 'earth'))
    expect(parent).toEqual('earth')
  })

  it('finds earth if reasonably close', () => {
    const parent = findStrongestParent(
      state,
      produce(getPosition(state, 'earth'), (p) => {
        p.x += 0.01
      })
    )
    expect(parent).toEqual('earth')
  })

  it('finds sol if further away from earth', () => {
    const parent = findStrongestParent(
      state,
      produce(getPosition(state, 'earth'), (p) => {
        p.x += 1
      })
    )
    expect(parent).toEqual('sol')
  })
})
