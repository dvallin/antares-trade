import { h } from 'preact'

import { useApplicationState } from '../application-state'
import { getUsedCargo } from './state'

export default () => {
  const [state] = useApplicationState()
  const selected = state.map.selected
  if (!selected) {
    return <div>nothing selected</div>
  }
  const cargo = state.ships.cargo[selected]
  return (
    <div>
      <h2>
        Cargo ({getUsedCargo(cargo)}/{cargo.total})
      </h2>
      <table class="table">
        <tbody>
          {Object.entries(cargo.stock).map(([comodity, amount]) => (
            <tr key={comodity}>
              <td scope="row">{comodity}</td>
              <td scope="row">{amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
