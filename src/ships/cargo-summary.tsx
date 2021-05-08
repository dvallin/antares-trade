import { h } from 'preact'

import { useApplicationState } from '../application-state'
import { getComodityAmount, getUsedCargo } from './cargo'

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
        Cargo ({getUsedCargo(cargo).toFixed(0)}/{cargo.total})
      </h2>
      <table class="table table-sm">
        <tbody>
          {Object.keys(cargo.stock).map((comodity) => (
            <tr key={comodity}>
              <td scope="row">{comodity}</td>
              <td scope="row">{getComodityAmount(cargo, comodity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
