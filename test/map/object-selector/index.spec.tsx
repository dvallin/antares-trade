import produce from 'immer'
import { initialState } from '../../../src/application-state'
import { Body } from '../../../src/body/state'
import ObjectSelector from '../../../src/map/object-selector'
import { Specs } from '../../../src/ships/state'
import { chain, Mutation, State } from '../../../src/state'
import { createShallowMount, mockApplicationState } from '../../test-utils'

function withShip(name: string, type: Specs['type']): Mutation<State> {
  return (s) => {
    s.ships.specs[name] = {
      speed: 0,
      docks: { total: 1, docked: [] },
      type,
    }
    s.bodies.bodies[name] = {
      type: 'artificial',
      radius: 0,
    }
    s.names.names[name] = { name }
  }
}
function withBody(name: string, type: Body['type']): Mutation<State> {
  return (s) => {
    s.bodies.bodies[name] = {
      type,
      radius: 0,
    }
    s.names.names[name] = { name }
  }
}

describe('ObjectSelector', () => {
  const state = produce(
    initialState,
    chain(
      withShip('fighter', 'fighter'),
      withShip('freighter', 'freighter'),
      withShip('station', 'station'),
      withBody('planet', 'planet'),
      withBody('belt', 'belt'),
      withBody('gas-giant', 'gas-giant'),
      withBody('moon', 'moon'),
      withBody('star', 'star')
    )
  )

  const mount = createShallowMount(ObjectSelector, {
    objects: ['fighter', 'freighter', 'station', 'planet', 'belt', 'gas-giant', 'moon', 'star'],
    onSelect: jest.fn(),
  })

  it('filters relevant objects initially', () => {
    mockApplicationState(state)
    const wrapper = mount()
    expect(wrapper).toMatchSnapshot()
  })
  it('filters ships', () => {
    mockApplicationState(state)
    const wrapper = mount()
    wrapper.find('[data-testid="filterShips"]').simulate('click')
    expect(wrapper).toMatchSnapshot()
  })
  it('filters ships', () => {
    mockApplicationState(state)
    const wrapper = mount()
    wrapper.find('[data-testid="filterStations"]').simulate('click')
    expect(wrapper).toMatchSnapshot()
  })
  it('filters ships', () => {
    mockApplicationState(state)
    const wrapper = mount()
    wrapper.find('[data-testid="filterBodies"]').simulate('click')
    expect(wrapper).toMatchSnapshot()
  })
  it('filters relevant objects', () => {
    mockApplicationState(state)
    const wrapper = mount()
    wrapper.find('[data-testid="filterBodies"]').simulate('click')
    wrapper.find('[data-testid="filterRelevant"]').simulate('click')
    expect(wrapper).toMatchSnapshot()
  })
})
