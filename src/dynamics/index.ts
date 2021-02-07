import { DynamicsState } from './state'

export function collectEntities(state: DynamicsState, system: string): string[] {
  return Object.entries(state.positions)
    .filter(([_, position]) => position.system === system)
    .map(([key]) => key)
}
