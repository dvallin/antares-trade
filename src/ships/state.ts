import { addBodyForShip, getEscapeVelocity } from '../body/state'
import { Movement, positionObjectAt, setMovement } from '../dynamics/movement'
import { getLocation, isNamedLocation, Location } from '../dynamics/position'
import { initTradeRouting, Market, setMarket, setTradeRoute } from '../market/state'
import { TradeRoute } from '../market/trade-route'
import { setName } from '../meta-data/state'
import { detachOrbit } from '../star-system/state'
import { chain, Mutation, State, Storage } from '../state'
import { Cargo, Stock, updateStock } from './cargo'
import { Docks, isDocked, undockShip } from './docks'

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
  tradeRoute?: TradeRoute
}
export const createShip = (props: CreateShipProps): Mutation<State> =>
  chain(
    addShip(props.id, props.owner, props.type, props.speed, props.totalDocks, props.totalCargo, props.stock || {}),
    addBodyForShip(props.id, props.type),
    setName(props.id, props.name),
    positionObjectAt(props.id, props.location),
    setMarket(props.id, props.market),
    setTradeRoute(props.id, props.tradeRoute)
  )

export const getEscapeEnergyCost = (state: State, location: string): number => {
  return Math.floor(getEscapeVelocity(state, location) || 0)
}

export const escape = (id: string): Mutation<State> => (state) => {
  const p = state.dynamics.positions[id]
  if (isNamedLocation(p)) {
    const needsEscape = getLocation(state, id) === getLocation(state, p)
    if (needsEscape) {
      updateStock(id, 'energyCells', -getEscapeEnergyCost(state, p))
    }
  }
}

export const canEscape = (state: State, id: string): boolean => {
  const p = state.dynamics.positions[id]
  if (isNamedLocation(p)) {
    const cost = getEscapeEnergyCost(state, p)
    return cost !== undefined ? (state.ships.cargo[id].stock['energyCells'] || 0) >= cost : true
  }
  return true
}

export const moveShip = (ship: string, to: Movement['to'], v: number): Mutation<State> => (state) => {
  const move = setMovement(ship, to, v)
  if (!isDocked(state, ship)) {
    chain(detachOrbit(ship), move)(state)
  } else if (canEscape(state, ship)) {
    chain(undockShip(ship), escape(ship), move)(state)
  }
}
