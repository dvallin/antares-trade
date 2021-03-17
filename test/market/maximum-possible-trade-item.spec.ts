import produce from 'immer'
import { initialState } from '../../src/application-state'
import { maximumPossibleTradeItem } from '../../src/market/trade'
import { Cargo } from '../../src/ships/cargo'

const state = (rate: { buy?: number; sell?: number }, fromCargo: Cargo, toCargo: Cargo, fromBalance: number, toBalance: number) =>
  produce(initialState, (d) => {
    d.market.markets['from'] = {
      production: [],
      rates: {
        a: rate,
      },
    }
    d.ships.cargo['from'] = fromCargo
    d.ships.cargo['to'] = toCargo
    d.ships.controllable['from'] = { by: 'p1' }
    d.ships.controllable['to'] = { by: 'p2' }
    d.market.balances['p1'] = fromBalance
    d.market.balances['p2'] = toBalance
  })

describe('maximumPossibleTradeItem', () => {
  const emptyCargo: Cargo = { total: 100, stock: {} }
  const cargo = (amount: number): Cargo => ({ total: 100, stock: { a: amount } })

  it('returns undefined if rate does not exist', () => {
    const s = state({}, emptyCargo, emptyCargo, 10, 10)
    expect(maximumPossibleTradeItem(s, 'from', 'to', 'a', 'sell', undefined)).toBeUndefined()
    expect(maximumPossibleTradeItem(s, 'from', 'to', 'not exists', 'sell', undefined)).toBeUndefined()
  })

  it('returns undefined if nothing to buy', () => {
    const s = state({ buy: 1 }, emptyCargo, emptyCargo, 10, 10)
    expect(maximumPossibleTradeItem(s, 'from', 'to', 'a', 'buy', undefined)).toBeUndefined()
  })
  it('returns undefined if nothing to sell', () => {
    const s = state({ sell: 1 }, emptyCargo, emptyCargo, 10, 10)
    expect(maximumPossibleTradeItem(s, 'from', 'to', 'a', 'sell', undefined)).toBeUndefined()
  })

  it('sells everything if possible', () => {
    const s = state({ sell: 2 }, cargo(10), emptyCargo, 0, 20)
    expect(maximumPossibleTradeItem(s, 'from', 'to', 'a', 'sell', undefined)).toEqual({ amount: 10, price: 20 })
  })
  it('buys everything if possible', () => {
    const s = state({ buy: 2 }, emptyCargo, cargo(10), 20, 0)
    expect(maximumPossibleTradeItem(s, 'from', 'to', 'a', 'buy', undefined)).toEqual({ amount: 10, price: -20 })
  })

  it('sells only as much as wanted', () => {
    const s = state({ sell: 2 }, cargo(10), emptyCargo, 0, 20)
    expect(maximumPossibleTradeItem(s, 'from', 'to', 'a', 'sell', 5)).toEqual({ amount: 5, price: 10 })
  })
  it('buys only as much as wanted', () => {
    const s = state({ buy: 2 }, emptyCargo, cargo(10), 20, 0)
    expect(maximumPossibleTradeItem(s, 'from', 'to', 'a', 'buy', 5)).toEqual({ amount: 5, price: -10 })
  })

  it('sells only as much as the cargo can hold', () => {
    const s = state({ sell: 2 }, cargo(5), emptyCargo, 0, 20)
    expect(maximumPossibleTradeItem(s, 'from', 'to', 'a', 'sell', undefined)).toEqual({ amount: 5, price: 10 })
  })
  it('buys only as much as the cargo can hold', () => {
    const s = state({ buy: 2 }, emptyCargo, cargo(5), 20, 0)
    expect(maximumPossibleTradeItem(s, 'from', 'to', 'a', 'buy', undefined)).toEqual({ amount: 5, price: -10 })
  })

  it('sells only as much as affordable', () => {
    const s = state({ sell: 2 }, cargo(10), emptyCargo, 0, 10)
    expect(maximumPossibleTradeItem(s, 'from', 'to', 'a', 'sell', undefined)).toEqual({ amount: 5, price: 10 })
  })
  it('buys only as much as affordable', () => {
    const s = state({ buy: 2 }, emptyCargo, cargo(10), 10, 0)
    expect(maximumPossibleTradeItem(s, 'from', 'to', 'a', 'buy', undefined)).toEqual({ amount: 5, price: -10 })
  })
})
