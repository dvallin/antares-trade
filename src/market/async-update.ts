import { current } from 'immer'
import { Mutation, State } from '../state'
import { applyMarketUpdate, MarketUpdate } from './market-update'

let fetchStarted: number | undefined = undefined
let updated = false
let updates: MarketUpdate[] = []

let worker: Worker | undefined
if (typeof Worker !== 'undefined') {
  worker = new Worker('./worker.ts', { type: 'module' })
  worker.onmessage = (e: MessageEvent<MarketUpdate[]>) => {
    updated = true
    updates = e.data
  }
}

export const asyncUpdateMarkets = (): Mutation<State> => (state) => {
  if (fetchStarted === undefined) {
    fetchStarted = Date.now()
    const dt = (fetchStarted - state.market.lastUpdate) / 1000
    worker?.postMessage({ state: current(state), dt })
  } else if (updated) {
    updates.forEach((update) => applyMarketUpdate(state, update))
    state.market.lastUpdate = fetchStarted
    updates = []
    updated = false
    fetchStarted = undefined
  }
}
