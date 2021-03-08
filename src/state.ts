import { Draft } from 'immer'

import { StarSystemState } from './star-system/state'
import { MapState } from './map/state'
import { NameState } from './meta-data/state'
import { BodyState } from './body/state'
import { ShipsState } from './ships/state'
import { DynamicsState } from './dynamics/state'
import { MarketState } from './market/state'

export type Mutation<State> = (draft: Draft<State>) => void
export type Mutate<State> = (mutation: Mutation<State>) => void

export function chain(...mutations: Mutation<State>[]): Mutation<State> {
  return (d) => {
    mutations.forEach((m) => m(d))
  }
}

export interface Storage<C> {
  [entity: string]: C
}
export interface State {
  starSystems: StarSystemState
  map: MapState
  market: MarketState
  names: NameState
  bodies: BodyState
  dynamics: DynamicsState
  ships: ShipsState
}
