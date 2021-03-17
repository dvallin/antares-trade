import { testMutation } from '../test-utils'
import { dist } from '../../src/geometry'
import { applyStarSystem, getPosition } from '../../src/dynamics/position'
import { initialStateWithDynamics as state, getAsPosition } from '../test-state'
import { getCurrentStarSystem } from '../../src/star-system/state'

describe('applyStarSystem', () => {
  it('recursively applies star system changes', () => {
    const system = getCurrentStarSystem(state)
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
