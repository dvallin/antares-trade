export type operation = 'sell' | 'buy'

export interface Rates {
  [comodity: string]: {
    [o in operation]?: number
  }
}

export function getRateType(amount: number, sellerSide = true): operation {
  return (sellerSide ? amount > 0 : amount <= 0) ? 'sell' : 'buy'
}

export function getRateSign(rateType: operation, sellerSide = true): number {
  return (sellerSide ? 1 : -1) * (rateType === 'sell' ? 1 : -1)
}

export function getPrice(rates: Rates, comodity: string, amount: number, sellerSide = true): number {
  const rateType = getRateType(amount, sellerSide)
  const pricePerUnit = rates[comodity][rateType] || 0
  return pricePerUnit * amount
}

export function getComodities(rates: Rates, operation: operation | undefined): string[] {
  return Object.entries(rates)
    .filter(([, rate]) => operation === undefined || rate[operation] !== undefined)
    .map(([key]) => key)
}

export function getDefaultRate(rates: Rates): { operation: operation; comodity: string } {
  let operation: 'buy' | 'sell' = 'buy'
  let comodity = getComodities(rates, 'buy')[0]
  if (!comodity) {
    operation = 'sell'
    comodity = getComodities(rates, 'sell')[0]
  }
  return { operation, comodity }
}
