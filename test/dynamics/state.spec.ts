import { testMutation } from '../test-utils'
import { initialState } from '../../src/application-state'
import { collectEntities } from '../../src/dynamics'
import { chain } from '../../src/state'
import { updateStarSystems } from '../../src/star-system/state'
import { initDynamics } from '../../src/dynamics/state'

describe('initDynamics', () => {
  it('does not initialize twice', () => {
    const newState = testMutation(chain(initDynamics, updateStarSystems(1)), initialState)
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
