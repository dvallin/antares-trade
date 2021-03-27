import { h, FunctionComponent } from 'preact'
import { shallow, ShallowWrapper } from 'enzyme'
import produce from 'immer'

import { Mutation, State } from '../src/state'
import { initialState } from '../src/application-state'
import * as ApplicationState from '../src/application-state'

export function createShallowMount<Props>(
  Component: FunctionComponent<Props>,
  props: Props
): (update?: Partial<Props>) => ShallowWrapper<Props> {
  return (update) => shallow(<Component {...{ ...props, ...(update || {}) }} />)
}

export function testMutation(mutation: Mutation<State>, state = initialState): State {
  return produce(state, mutation)
}

export function mockApplicationState(state: State = initialState, onChange: (s: State) => void = () => undefined): void {
  let currentState = state
  jest.spyOn(ApplicationState, 'useApplicationState').mockImplementation(() => [
    currentState,
    (mutation: Mutation<State>) => {
      currentState = produce(currentState, (d) => {
        mutation(d)
      })
      onChange(currentState)
    },
  ])
}
