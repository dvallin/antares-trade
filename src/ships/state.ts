import { addBodyForShip } from '../body/state'
import { Movement, positionObjectAt, setMovement } from '../dynamics/movement'
import { Location } from '../dynamics/position'
import { initTradeRouting } from '../market/state'
import { setName } from '../meta-data/state'
import { detachOrbit } from '../star-system/state'
import { chain, Mutation, State, Storage } from '../state'
import { Cargo, Stock } from './cargo'
import { Docks, undockShip } from './docks'

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
  controllable: {
    spaceStation1: { by: 'ai' },
    heavyWeapons: { by: 'ai' },
    solarPanel: { by: 'ai' },
    advancedMaterials: { by: 'ai' },
    fluxTube: { by: 'ai' },
  },
  specs: {
    spaceStation1: { type: 'station', speed: 0.01, docks: docks(100) },
    heavyWeapons: { type: 'station', speed: 0.0, docks: docks(4) },
    solarPanel: { type: 'station', speed: 0.0, docks: docks(4) },
    advancedMaterials: { type: 'station', speed: 0.0, docks: docks(4) },
    fluxTube: { type: 'station', speed: 0.0, docks: docks(4) },
  },
  cargo: {
    heavyWeapons: {
      total: 20000,
      stock: { clothing: 20, food: 100, energyCells: 100, uranium: 20 },
    },
    spaceStation1: {
      total: 20000,
      stock: { clothing: 20, food: 100, energyCells: 100 },
    },
    solarPanel: {
      total: 20000,
      stock: {},
    },
    advancedMaterials: {
      total: 20000,
      stock: { energyCells: 100, metals: 100 },
    },
    fluxTube: {
      total: 20000,
      stock: {},
    },
  },
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
}
export const createShip = (props: CreateShipProps): Mutation<State> =>
  chain(
    addShip(props.id, props.owner, props.type, props.speed, props.totalDocks, props.totalCargo, props.stock || {}),
    addBodyForShip(props.id, props.type),
    setName(props.id, props.name),
    positionObjectAt(props.id, props.location)
  )

export const moveShip = (ship: string, to: Movement['to'], v: number): Mutation<State> =>
  chain(undockShip(ship), detachOrbit(ship), setMovement(ship, to, v))
