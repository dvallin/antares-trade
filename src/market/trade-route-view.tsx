import { Fragment, h } from 'preact'
import { useApplicationState } from '../application-state'
import Location from '../map/location'

export default (props: { id: string }) => {
  const [state] = useApplicationState()
  const hasTradeAutomation = state.ships.specs[props.id]?.type === 'freighter'
  const route = state.market.routes[props.id]
  if (!hasTradeAutomation || !route) {
    return <Fragment />
  }
  return (
    <div>
      <h2>Trade Route</h2>
      <ul class="list-group">
        {route.steps.map((step, index) => (
          <li class="list-group-item" key={index}>
            <Location location={step.location} />
            <ul class="list-group">
              {step.trades.map((trade, index) => (
                <li class="list-group-item" key={index}>
                  {trade.operation} {trade.amount} {trade.comodity}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
