import { Draft } from 'immer'

import { updateStarSystems } from './star-system/state'
import { updateMap } from './map/state'
import { updateDynamics } from './dynamics/state'

import { saveObject } from './local-storage'
import { updateTradeRoutes } from './market/trade-route'
import { chain, State } from './state'
import { stateVersion } from './init-state'
import { asyncUpdateMarkets } from './market/async-update'
import { updateMarkets } from './market/market-update'

export const updateInterval = 30
// update a maximum of 1 minutes at a time
// so being offline makes you lose not more than a minute in an automation step
export const updateMaximumDt = 60 * 1000
export const saveInterval = 1000

export const update = (state: Draft<State>): void => {
  const now = Date.now()
  const delta = now - state.lastUpdate
  const isDeltaUpdate = delta < 100

  const dtMs = Math.min(delta, updateMaximumDt)
  const dt = dtMs / 1000
  if (isDeltaUpdate) {
    state.lastUpdate += dtMs
    chain(updateStarSystems(dt), updateDynamics(dt), updateMap, asyncUpdateMarkets(), updateTradeRoutes)(state)
  } else {
    while (state.lastUpdate < now && Date.now() - now < 100) {
      state.lastUpdate += dtMs
      chain(updateStarSystems(dt), updateDynamics(dt), updateMap, updateMarkets(dt), updateTradeRoutes)(state)
    }
  }

  if (now - state.lastSave >= saveInterval) {
    state.lastSave = now
    saveObject(state, stateVersion, 'state')
  }
}
