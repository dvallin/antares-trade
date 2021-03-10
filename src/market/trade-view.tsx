import produce from 'immer'
import { Fragment, h } from 'preact'
import { memo } from 'preact/compat'
import { useState } from 'preact/hooks'

import { useApplicationState } from '../application-state'
import { Cargo, getComodityAmount } from '../ships/cargo'
import { getDockedShipsOfLocation, isControlledBy } from '../ships/state'
import { Trade, getTotal } from './trade'
import { performTrade, validateTrade, Market } from './state'
import { getPrice, getRateType } from './rates'

export const TradeSlider = (props: {
  comodity: string
  shipCargo: Cargo
  stationCargo: Cargo
  market: Market
  onInput: (selection: number) => void
}) => {
  const [selection, setSelection] = useState(0)
  const price = getPrice(props.market.rates, props.comodity, selection)
  return (
    <div className="row">
      <div className="col">
        <label htmlFor={`${props.comodity}-slider`} class="form-label">
          {props.comodity}
        </label>
        <input
          type="range"
          class="form-range"
          min={-getComodityAmount(props.shipCargo, props.comodity)}
          max={getComodityAmount(props.stationCargo, props.comodity)}
          step="1"
          value={selection}
          id={`${props.comodity}-slider`}
          onInput={(e) => {
            const v = Number((e.target as HTMLInputElement).value)
            setSelection(v)
            props.onInput(v)
          }}
        />
      </div>

      <div className="col">
        {getRateType(selection, false)} {Math.abs(selection)} {Math.sign(price) > 0 ? 'costing' : 'earning'} {Math.abs(price)}
      </div>
    </div>
  )
}

export const TradeWithShip = (props: { id: string; ship: string }) => {
  const [state, mutate] = useApplicationState()
  const [trade, setTrade] = useState<Trade>({})
  const market = state.market.markets[props.id]
  const stationCargo = state.ships.cargo[props.id]
  const shipCargo = state.ships.cargo[props.ship]
  const total = getTotal(trade).price
  const errors = validateTrade(state, props.id, props.ship, trade)
  return (
    <Fragment>
      {Object.entries(market.rates).map(([comodity]) => (
        <TradeSlider
          key={comodity}
          comodity={comodity}
          shipCargo={shipCargo}
          stationCargo={stationCargo}
          market={market}
          onInput={(amount) => {
            setTrade(
              produce(trade, (t) => {
                t[comodity] = { amount, price: getPrice(market.rates, comodity, amount) }
              })
            )
          }}
        />
      ))}
      <div>
        the trade {Math.sign(total) > 0 ? 'costs' : 'earns'} you {Math.abs(total)}{' '}
      </div>
      {errors.map((e, i) => (
        <div key={i} className="text-danger">
          {e}
        </div>
      ))}
      <button
        class="btn btn-primary"
        onClick={() => {
          mutate(performTrade(props.id, props.ship, trade))
          setTrade({})
        }}
        disabled={errors.length > 0}
      >
        trade
      </button>
    </Fragment>
  )
}

export const ShipSelector = memo(
  (props: { ships: { key: string; name: string }[]; ship: string; setShip: (ship: string) => void }) => {
    return (
      <select class="form-select" onChange={(e) => props.setShip((e.target as HTMLSelectElement).value)}>
        {props.ships.map(({ key, name }) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>
    )
  },
  (p1, p2) => p1.ships.length === p2.ships.length
)

export const TradeWith = (props: { id: string }) => {
  const [state] = useApplicationState()
  const [ship, setShip] = useState<string | undefined>(undefined)

  const playerShips = getDockedShipsOfLocation(state, props.id).filter((s) => isControlledBy(state, s, 'player'))
  if (playerShips.length === 0) {
    return <span>no ships docked to trade with</span>
  } else if (ship === undefined) {
    setShip(playerShips[0])
    return <span>no ships docked to trade with</span>
  } else {
    return (
      <Fragment>
        <ShipSelector
          ship={ship}
          setShip={setShip}
          ships={playerShips.map((key) => ({ key, name: state.names.names[key]?.name || 'unknown ship' }))}
        />
        <TradeWithShip id={props.id} ship={ship} />
      </Fragment>
    )
  }
}

export default () => {
  const [state] = useApplicationState()
  const selected = state.map.selected
  if (!selected) {
    return <div>nothing selected</div>
  }
  const market = state.market.markets[selected]
  const cargo = state.ships.cargo[selected]
  return (
    <div>
      <h2>Trading Comodities</h2>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">commodity</th>
            <th scope="col">available</th>
            <th scope="col">buys at</th>
            <th scope="col">sells at</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(market.rates).map(([comodity, pricing]) => (
            <tr key={comodity}>
              <td scope="row">{comodity}</td>
              <td scope="row">{getComodityAmount(cargo, comodity)}</td>
              <td scope="row">{pricing.buy || ''}</td>
              <td scope="row">{pricing.sell || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Trade With</h2>
      <TradeWith id={selected} />
    </div>
  )
}