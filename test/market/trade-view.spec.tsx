import produce from 'immer'
import { initialState } from '../../src/application-state'
import TradeView, { TradeSlider, TradeSliderProps, TradeWith, TradeWithShip } from '../../src/market/trade-view'
import { chain, Mutation, State } from '../../src/state'
import * as trade from '../../src/market/trade'

import { createShallowMount, mockApplicationState } from '../test-utils'

const withStation: Mutation<State> = (s) => {
  s.market.markets['station'] = {
    rates: { a: { sell: 1 }, b: { buy: 2, sell: 23 } },
    production: [],
  }
  s.ships.cargo['station'] = { total: 100, stock: { a: 4, b: 3 } }
  s.ships.controllable['station'] = { by: 'ai' }
}
const withDockedShip: Mutation<State> = (s) => {
  s.ships.specs['station'] = {
    speed: 0,
    docks: { total: 1, docked: ['ship'] },
    type: 'station',
  }
  s.ships.cargo['ship'] = { total: 100, stock: { b: 5 } }
  s.ships.controllable['ship'] = { by: 'player' }
  s.names.names['ship'] = { name: 'millenium falcon' }
}

describe('TradeView', () => {
  const mount = createShallowMount(TradeView, {})

  it('renders if nothing selected', () => {
    mockApplicationState()
    const component = mount()
    expect(component).toMatchSnapshot()
  })

  it('renders market info of selected', () => {
    mockApplicationState(
      produce(
        initialState,
        chain(withStation, (s) => {
          s.map.selected = 'station'
        })
      )
    )
    const component = mount()
    expect(component).toMatchSnapshot()
  })
})

describe('TradeWith', () => {
  const mount = createShallowMount(TradeWith, { id: 'station' })

  it('renders no ships docked', () => {
    mockApplicationState(produce(initialState, withStation))
    const component = mount()
    expect(component).toMatchSnapshot()
  })

  it('renders ship selector', () => {
    mockApplicationState(produce(initialState, chain(withStation, withDockedShip)))
    const component = mount()
    expect(component).toMatchSnapshot()
  })
})

describe('TradeWithShip', () => {
  const mount = createShallowMount(TradeWithShip, { id: 'station', ship: 'ship' })

  const performTrade = jest.spyOn(trade, 'performTrade')
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('performs empty trade', () => {
    mockApplicationState(produce(initialState, chain(withStation, withDockedShip)))
    const component = mount()
    component.find('[data-testid="performTrade"]').simulate('click')
    expect(performTrade).toHaveBeenCalledWith('station', 'ship', {})
  })

  it('performs a trade', () => {
    mockApplicationState(produce(initialState, chain(withStation, withDockedShip)))
    const component = mount()
    component.find<TradeSliderProps>(TradeSlider).first().props().onInput(4)
    component.find('[data-testid="performTrade"]').simulate('click')
    expect(performTrade).toHaveBeenCalledWith('station', 'ship', { a: { amount: 4, price: 4 } })
  })
})
