import { createShallowMount } from './test-utils'
import { App } from '../src/app'

describe('App', () => {
  const mount = createShallowMount(App, {})
  it('renders', () => {
    const component = mount()
    expect(component).toMatchSnapshot()
  })
})
