import { getAvailableCargo, getComodityAmount, getUsedCargo } from '../ships/cargo'
import { Mutation, State } from '../state'
import { getRateSign, operation } from './rates'

export type TradeItem = { amount: number; price: number }

export interface Trade {
  [comodity: string]: TradeItem
}

export function getTotal(trade: Trade): TradeItem {
  return Object.values(trade).reduce((a, b) => ({ amount: a.amount + b.amount, price: a.price + b.price }), { amount: 0, price: 0 })
}

export const maximumPossibleTradeItem = (
  state: State,
  from: string,
  to: string,
  comodity: string,
  operation: operation,
  maximumAmount: number | undefined
): TradeItem | undefined => {
  const amounts = []
  if (maximumAmount !== undefined) {
    amounts.push(maximumAmount)
  }

  const rates = state.market.markets[from].rates
  const rate = rates[comodity]?.[operation]
  if (rate === undefined) {
    return undefined
  }
  const sign = getRateSign(operation)
  const price = sign * rate
  const payer = state.ships.controllable[price < 0 ? from : to].by
  amounts.push(Math.floor(state.market.balances[payer] / Math.abs(price)))

  const fromCargo = state.ships.cargo[from]
  const toCargo = state.ships.cargo[to]
  if (operation === 'sell') {
    amounts.push(getComodityAmount(fromCargo, comodity))
    amounts.push(getAvailableCargo(toCargo))
  } else {
    amounts.push(getComodityAmount(toCargo, comodity))
    amounts.push(getAvailableCargo(fromCargo))
  }

  const amount = Math.min(...amounts)
  if (amount === 0) {
    return undefined
  }

  return { amount, price: amount * price }
}

export const performTrade = (from: string, to: string, trade: Trade): Mutation<State> => (d) => {
  const total = getTotal(trade)
  const fromOwner = d.ships.controllable[from].by
  const toOwner = d.ships.controllable[to].by
  d.market.balances[fromOwner] += total.price
  d.market.balances[toOwner] -= total.price

  const fromCargo = d.ships.cargo[from]
  const toCargo = d.ships.cargo[to]
  Object.entries(trade).forEach(([comodity, { amount }]) => {
    fromCargo.stock[comodity] = (fromCargo.stock[comodity] || 0) - amount
    toCargo.stock[comodity] = (toCargo.stock[comodity] || 0) + amount
  })
}

export const validateTrade = (state: State, from: string, to: string, trade: Trade): string[] => {
  const errors: string[] = []

  const total = getTotal(trade)
  const fromOwner = state.ships.controllable[from].by
  const toOwner = state.ships.controllable[to].by
  if (state.market.balances[fromOwner] + total.price < 0) {
    errors.push(`${fromOwner} has insufficient credits`)
  }
  if (state.market.balances[toOwner] - total.price < 0) {
    errors.push(`${toOwner} has insufficient credits`)
  }

  const fromCargo = state.ships.cargo[from]
  const toCargo = state.ships.cargo[to]
  if (getUsedCargo(fromCargo) - total.amount > fromCargo.total) {
    errors.push(`${state.names.names[from]?.name || 'unknown ship'} has insufficient storage capacity`)
  }
  if (getUsedCargo(toCargo) + total.amount > toCargo.total) {
    errors.push(`${state.names.names[to]?.name || 'unknown ship'} has insufficient storage capacity`)
  }

  return errors
}
