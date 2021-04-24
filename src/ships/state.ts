import { addBodyForShip } from '../body/state'
import { Movement, positionObjectAt, setMovement } from '../dynamics/movement'
import { Location } from '../dynamics/position'
import { initTradeRouting, Market, setMarket } from '../market/state'
import { setName } from '../meta-data/state'
import { detachOrbit } from '../star-system/state'
import { chain, Mutation, State, Storage } from '../state'
import { Cargo, Stock } from './cargo'
import { canUndock, Docks, isDocked, undockShip } from './docks'

export interface Specs {
  type: 'freighter' | 'station' | 'fighter'
  speed: number
  docks: Docks
}

export interface Controllable {
  by: string
}

export interface ShipsState {
  controllable: Storage<Controllable>
  specs: Storage<Specs>
  cargo: Storage<Cargo>
}

export const docks = (total: number): Docks => ({ total, docked: [] })
export const ships: ShipsState = {
  controllable: {},
  specs: {},
  cargo: {},
}

export const addShip = (
  id: string,
  owner: string,
  type: Specs['type'],
  speed: number,
  totalDocks: number,
  totalCargo: number,
  stock: Stock
): Mutation<State> => (s) => {
  s.ships.controllable[id] = { by: owner }
  s.ships.specs[id] = {
    type,
    speed,
    docks: docks(totalDocks),
  }
  s.ships.cargo[id] = {
    total: totalCargo,
    stock,
  }
  if (type === 'freighter') {
    initTradeRouting(id)(s)
  }
}

export const isControlledBy = (state: State, ship: string, player: string): boolean => state.ships.controllable[ship]?.by === player

export interface CreateShipProps {
  id: string
  owner: string
  location: Location
  name: string
  type: Specs['type']
  speed: Specs['speed']
  totalDocks: number
  totalCargo: number
  stock?: Stock
  market?: Market
}
export const createShip = (props: CreateShipProps): Mutation<State> =>
  chain(
    addShip(props.id, props.owner, props.type, props.speed, props.totalDocks, props.totalCargo, props.stock || {}),
    addBodyForShip(props.id, props.type),
    setName(props.id, props.name),
    positionObjectAt(props.id, props.location),
    setMarket(props.id, props.market)
  )

export const moveShip = (ship: string, to: Movement['to'], v: number): Mutation<State> => (state) => {
  const move = setMovement(ship, to, v)
  if (!isDocked(state, ship)) {
    chain(detachOrbit(ship), move)(state)
  } else if (canUndock(state, ship)) {
    chain(undockShip(ship), move)(state)
  }
}
