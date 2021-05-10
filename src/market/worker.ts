import { State } from '../state'
import { collectUpdates } from './market-update'

const ctx: Worker = (self as unknown) as Worker
ctx.addEventListener('message', (event: MessageEvent<{ state: State; dt: number }>) => {
  const { state, dt } = event.data
  ctx.postMessage(collectUpdates(state, dt))
})
