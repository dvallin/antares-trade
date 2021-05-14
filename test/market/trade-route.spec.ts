import produce from 'immer'
import { initialState } from '../../src/application-state'
import * as trade from '../../src/market/trade'
import { addStep, removeStep, TradeRouteStep, updateStep, updateTradeRoutes } from '../../src/market/trade-route'
import { createShip } from '../../src/ships/state'
import { chain } from '../../src/state'

const buyAtStation1: TradeRouteStep = { location: 'station1', comodity: 'a', operation: 'buy' }
const sellAtStation1: TradeRouteStep = { location: 'station1', comodity: 'b', operation: 'sell' }
const buy10PercentAtStation1: TradeRouteStep = { location: 'station1', comodity: 'a', operation: 'buy', percentage: 0.1 }
const sell10PercentAtStation1: TradeRouteStep = { location: 'station1', comodity: 'b', operation: 'sell', percentage: 0.1 }
const buyAtStation2: TradeRouteStep = { location: 'station2', comodity: 'b', operation: 'buy' }

const baseTestState = produce(
  initialState,
  chain(
    createShip({
      id: 'ship',
      owner: 'player',
      location: 'station1',
      type: 'freighter',
      name: '',
      speed: 0.7,
      totalCargo: 100,
      totalDocks: 0,
      tradeRoute: {
        currentStep: 0,
        steps: [],
      },
    }),
    createShip({
      id: 'station1',
      owner: 'ai',
      location: { system: 'sol', x: 10, y: 0 },
      type: 'station',
      name: '',
      speed: 0.7,
      totalCargo: 100,
      totalDocks: 1,
      market: {
        rates: {},
        production: [],
      },
    }),
    createShip({
      id: 'station2',
      owner: 'ai',
      location: { system: 'sol', x: 100, y: 0 },
      type: 'station',
      name: '',
      speed: 0.7,
      totalCargo: 100,
      totalDocks: 1,
      market: {
        rates: {},
        production: [],
      },
    })
  )
)

describe('addStep', () => {
  const testState = produce(baseTestState, (s) => {
    s.market.markets['station1'].rates = { a: { sell: 1 }, b: { buy: 2, sell: 23 } }
  })
  it('add step with closest station', () => {
    const result = produce(testState, addStep('ship'))
    expect(result.market.routes['ship'].steps).toHaveLength(1)
    expect(result.market.routes['ship'].steps[0]).toEqual(expect.objectContaining({ location: 'station1' }))
  })
  it('add step with default rate', () => {
    const result = produce(testState, addStep('ship'))
    expect(result.market.routes['ship'].steps).toHaveLength(1)
    expect(result.market.routes['ship'].steps[0]).toEqual(expect.objectContaining({ comodity: 'b', operation: 'buy' }))
  })
  it('add step with last station', () => {
    const s = produce(testState, (s) => {
      s.market.routes['ship'].steps = [buyAtStation2]
    })
    const result = produce(s, addStep('ship'))
    expect(result.market.routes['ship'].steps).toHaveLength(2)
    expect(result.market.routes['ship'].steps[1]).toEqual(expect.objectContaining({ location: 'station2' }))
  })
})

describe('removeStep', () => {
  const testState = produce(baseTestState, (s) => {
    s.market.routes['ship'] = {
      currentStep: 1,
      steps: [buyAtStation1, sellAtStation1, buyAtStation2],
    }
  })

  it('removes step at index', () => {
    const removedFirst = produce(testState, removeStep('ship', 0))
    const removedSecond = produce(testState, removeStep('ship', 1))

    expect(removedFirst.market.routes['ship'].steps).toEqual([sellAtStation1, buyAtStation2])
    expect(removedSecond.market.routes['ship'].steps).toEqual([buyAtStation1, buyAtStation2])
  })
  it('resets current step if necessary', () => {
    const removedFirst = produce(testState, removeStep('ship', 0))
    const removedThird = produce(testState, removeStep('ship', 2))
    const removedSecond = produce(testState, removeStep('ship', 1))
    const removeSecondAndThird = produce(testState, chain(removeStep('ship', 1), removeStep('ship', 1)))

    expect(removedFirst.market.routes['ship'].currentStep).toEqual(1)
    expect(removedSecond.market.routes['ship'].currentStep).toEqual(1)
    expect(removedThird.market.routes['ship'].currentStep).toEqual(1)
    expect(removeSecondAndThird.market.routes['ship'].currentStep).toEqual(0)
  })
})

describe('updateStep', () => {
  const testState = produce(baseTestState, (s) => {
    s.market.routes['ship'] = {
      currentStep: 1,
      steps: [buyAtStation1, sellAtStation1],
    }
  })

  it('updates step at index', () => {
    const updatedFirst = produce(testState, updateStep('ship', 0, { location: 'station3', comodity: 'a' }))
    const updatedSecond = produce(testState, updateStep('ship', 1, { location: 'station3', comodity: 'a' }))

    expect(updatedFirst.market.routes['ship'].steps).toEqual([{ location: 'station3', comodity: 'a', operation: 'buy' }, sellAtStation1])
    expect(updatedSecond.market.routes['ship'].steps).toEqual([buyAtStation1, { location: 'station3', comodity: 'a', operation: 'sell' }])
  })
})

describe('updateTradeRoute', () => {
  const testState = produce(baseTestState, (s) => {
    s.market.routes['ship'] = {
      currentStep: 0,
      steps: [buyAtStation1, sellAtStation1, buyAtStation2],
    }
    s.ships.cargo['ship'].stock['b'] = 5
    s.market.markets['station1'].rates = { a: { sell: 1 }, b: { buy: 2, sell: 23 } }
    s.ships.cargo['station1'].stock = { a: 4, b: 3 }
  })

  const performTrade = jest.spyOn(trade, 'performTrade')
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('goes to next step', () => {
    const s = produce(testState, updateTradeRoutes)
    expect(s.market.routes['ship'].currentStep).toEqual(1)
  })

  it('moves docked ship to next station', () => {
    const dockedShipWithRoute = produce(testState, (s) => {
      s.market.routes['ship'].currentStep = 2
    })
    const s = produce(dockedShipWithRoute, updateTradeRoutes)
    expect(s.dynamics.movements['ship'].to).toEqual('station2')
  })

  describe('buying and selling operations', () => {
    it('buys all', () => {
      produce(testState, updateTradeRoutes)
      expect(performTrade).toHaveBeenCalledWith('station1', 'ship', { a: { amount: 4, price: 4 } })
    })

    it('buys one', () => {
      const dockedShipWithRoute = produce(testState, (s) => {
        s.market.routes['ship'] = {
          currentStep: 0,
          steps: [buy10PercentAtStation1, sellAtStation1],
        }
      })
      produce(dockedShipWithRoute, updateTradeRoutes)
      expect(performTrade).toHaveBeenCalledWith('station1', 'ship', { a: { amount: 1, price: 1 } })
    })

    it('sells all', () => {
      const dockedShipWithRoute = produce(testState, (s) => {
        s.market.routes['ship'] = {
          currentStep: 0,
          steps: [sellAtStation1, buyAtStation1],
        }
      })
      produce(dockedShipWithRoute, updateTradeRoutes)
      expect(performTrade).toHaveBeenCalledWith('station1', 'ship', { b: { amount: -5, price: -10 } })
    })

    it('sells one', () => {
      const dockedShipWithRoute = produce(testState, (s) => {
        s.market.routes['ship'] = {
          currentStep: 0,
          steps: [sell10PercentAtStation1, buyAtStation1],
        }
      })
      produce(dockedShipWithRoute, updateTradeRoutes)
      expect(performTrade).toHaveBeenCalledWith('station1', 'ship', { b: { amount: -1, price: -2 } })
    })
  })
})
