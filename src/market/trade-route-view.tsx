import { Fragment, h } from 'preact'
import { memo } from 'preact/compat'
import { useApplicationState } from '../application-state'
import { collectTradingLocations } from '../dynamics'
import { getComodities } from './rates'
import { addStep, removeStep, updateStep } from './trade-route'

export const Select = memo(
  (props: { current: string; values: string[]; onChange: (value: string) => void }) => {
    if (props.values.length > 0 && !props.values.includes(props.current)) {
      props.onChange(props.values[0])
    }
    return (
      <select class="form-select" onChange={(e) => props.onChange((e.target as HTMLSelectElement).value)}>
        {props.values.map((v) => (
          <option key={v} value={v} selected={v === props.current}>
            {v}
          </option>
        ))}
      </select>
    )
  },
  (p1, p2) => p1.current === p2.current && p1.values.every((v, i) => p2.values[i] === v)
)

export default (props: { id: string }) => {
  const [state, mutate] = useApplicationState()
  const hasTradeAutomation = state.ships.specs[props.id]?.type === 'freighter'
  const route = state.market.routes[props.id]
  const locations = collectTradingLocations(state, props.id)
  if (!hasTradeAutomation || !route) {
    return <Fragment />
  }
  return (
    <div>
      <h2>Trade Route</h2>{' '}
      <div class="table-responsive-sm">
        <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col">location</th>
              <th scope="col">operation</th>
              <th scope="col">amount</th>
              <th scope="col">comodity</th>
              <th scope="col">delete</th>
            </tr>
          </thead>
          <tbody>
            {route.steps.map((step, index) => {
              const rates = state.market.markets[step.location]?.rates
              return (
                <tr key={index}>
                  <td scope="row">
                    <Select
                      current={step.location}
                      values={locations}
                      onChange={(v) => mutate(updateStep(props.id, index, { location: v }))}
                    />
                  </td>
                  <td scope="row">
                    <Select
                      current={step.operation}
                      values={['buy', 'sell']}
                      onChange={(v) => mutate(updateStep(props.id, index, { operation: v as 'buy' | 'sell' }))}
                    />
                  </td>
                  <td class="col-md-2" scope="row">
                    <input
                      type="number"
                      class="form-control"
                      placeholder="all"
                      maxLength={4}
                      onChange={(e) => {
                        const value = Number((e.target as HTMLSelectElement).value)
                        mutate(updateStep(props.id, index, { amount: Number.isNaN(value) ? undefined : value }))
                      }}
                    />
                  </td>
                  <td scope="row">
                    <Select
                      current={step.comodity}
                      values={rates !== undefined ? getComodities(rates, step.operation === 'buy' ? 'sell' : 'buy') : []}
                      onChange={(v) => mutate(updateStep(props.id, index, { comodity: v }))}
                    />
                  </td>
                  <td scope="row">
                    <button class="btn btn-primary" onClick={() => mutate(removeStep(props.id, index))}>
                      -
                    </button>
                  </td>
                </tr>
              )
            })}
            <tr>
              <td colSpan={6}>
                <button class="btn btn-primary" onClick={() => mutate(addStep(props.id))}>
                  +
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
