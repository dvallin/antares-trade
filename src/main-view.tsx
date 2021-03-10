import { h } from 'preact'
import { useState } from 'preact/hooks'
import { useApplicationState } from './application-state'

import Map from './map'
import FocusedObject from './map/focused-object'
import TradeView from './market/trade-view'
import CargoSummary from './ships/cargo-summary'

export type Focus = 'map' | 'info' | 'trading' | 'cargo'

const renderNavLink = (name: Focus, text: string, focus: Focus, setFocus: (value: Focus) => void) => (
  <li key={name} class="nav-item">
    <a class="nav-link" href="#" onClick={() => setFocus(name)} selected={focus === name}>
      {text}
    </a>
  </li>
)

export default () => {
  const [state] = useApplicationState()
  const [focus, setFocus] = useState<Focus>('map')
  const selected = state.map.selected
  const navItems = [renderNavLink('map', 'Map', focus, setFocus)]

  const infoAvailable = selected !== undefined
  const tradingAvailable = selected !== undefined && state.market.markets[selected] !== undefined
  const cargoAvailable = selected !== undefined && state.ships.controllable[selected]?.by === 'player'
  if (infoAvailable) {
    navItems.push(renderNavLink('info', 'Info', focus, setFocus))
  }
  if (tradingAvailable) {
    navItems.push(renderNavLink('trading', 'Trading', focus, setFocus))
  }
  if (cargoAvailable) {
    navItems.push(renderNavLink('cargo', 'Cargo', focus, setFocus))
  }

  let currentView = <Map />
  switch (focus) {
    case 'info':
      if (infoAvailable) {
        currentView = <FocusedObject />
      }
      break
    case 'trading':
      if (tradingAvailable) {
        currentView = <TradeView />
      }
      break
    case 'cargo':
      if (cargoAvailable) {
        currentView = <CargoSummary />
      }
      break
  }

  return (
    <div>
      <ul class="nav nav-tabs">{navItems}</ul>
      {currentView}
    </div>
  )
}
