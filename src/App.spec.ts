import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from './App.vue'

describe('App', () => {
  it('renders title and starts counter at zero', () => {
    const wrapper = mount(App)

    expect(wrapper.get('h1').text()).toBe('Second Framework')
    expect(wrapper.get('[data-testid="counter"]').text()).toContain('Count is 0')
  })

  it('increments count on click', async () => {
    const wrapper = mount(App)
    const button = wrapper.get('[data-testid="counter"]')

    await button.trigger('click')
    expect(button.text()).toContain('Count is 1')

    await button.trigger('click')
    expect(button.text()).toContain('Count is 2')
  })
})
