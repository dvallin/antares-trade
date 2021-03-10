export type TradeItem = { amount: number; price: number }

export interface Trade {
  [comodity: string]: TradeItem
}

export function getTotal(trade: Trade): TradeItem {
  return Object.values(trade).reduce((a, b) => ({ amount: a.amount + b.amount, price: a.price + b.price }), { amount: 0, price: 0 })
}
