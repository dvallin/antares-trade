import produce from 'immer'
import { initialState } from '../../src/application-state'
import { applyProduction, Production, productionTimestep } from '../../src/market/production'
import { Cargo, Stock } from '../../src/ships/cargo'

const state = (cargo: Cargo) =>
  produce(initialState, (d) => {
    d.ships.cargo['ship'] = cargo
  })

describe('applyProduction', () => {
  const emptyCargo: Cargo = { total: 100, stock: {} }
  const emptyProduction: Production = {
    resource: [],
    consumes: {},
    produces: {},
  }
  const cargo = (stock: Stock): Cargo => ({ total: 100, stock })

  it('applies empty production', () => {
    const newState = produce(state(emptyCargo), (s) => applyProduction(s, productionTimestep, 'ship', emptyProduction))
    expect(newState.ships.cargo['ship']).toEqual(emptyCargo)
  })

  it('does not consume missing comodity', () => {
    const production: Production = produce(emptyProduction, (p) => {
      p.consumes['a'] = 1
    })
    const newState = produce(state(emptyCargo), (s) => applyProduction(s, productionTimestep, 'ship', production))
    expect(newState.ships.cargo['ship']).toEqual(emptyCargo)
  })

  it('consumes comodity', () => {
    const production: Production = produce(emptyProduction, (p) => {
      p.consumes['a'] = 1
    })
    const newState = produce(state(cargo({ a: 1 })), (s) => applyProduction(s, productionTimestep, 'ship', production))
    expect(newState.ships.cargo['ship']).toEqual(cargo({ a: 0 }))
  })

  it('does not overconsume', () => {
    const production: Production = produce(emptyProduction, (p) => {
      p.consumes['a'] = 1
    })
    const newState = produce(state(cargo({ a: 1 })), (s) => applyProduction(s, 2 * productionTimestep, 'ship', production))
    expect(newState.ships.cargo['ship']).toEqual(cargo({ a: 1 }))
  })

  it('produces comodity', () => {
    const production: Production = produce(emptyProduction, (p) => {
      p.consumes['a'] = 1
      p.produces['b'] = 1
    })
    const newState = produce(state(cargo({ a: 1 })), (s) => applyProduction(s, productionTimestep, 'ship', production))
    expect(newState.ships.cargo['ship']).toEqual(cargo({ a: 0, b: 1 }))
  })

  it('does not overconsume', () => {
    const production: Production = produce(emptyProduction, (p) => {
      p.consumes['a'] = 1
      p.produces['b'] = 101
    })
    const newState = produce(state(cargo({ a: 1 })), (s) => applyProduction(s, productionTimestep, 'ship', production))
    expect(newState.ships.cargo['ship']).toEqual(cargo({ a: 1 }))
  })
})
