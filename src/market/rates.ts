export interface Rates {
  [comodity: string]: {
    buy?: number
    sell?: number
  }
}

export function getRateType(amount: number, sellerSide = true): 'sell' | 'buy' {
  return (sellerSide ? amount > 0 : amount <= 0) ? 'sell' : 'buy'
}

export function getPrice(rates: Rates, comodity: string, amount: number, sellerSide = true): number {
  const rateType = getRateType(amount, sellerSide)
  const pricePerUnit = rates[comodity][rateType] || 0
  return pricePerUnit * amount
}
