import produce from 'immer'
import { initialState } from '../../src/application-state'
import { addBodyForShip } from '../../src/body/state'

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
