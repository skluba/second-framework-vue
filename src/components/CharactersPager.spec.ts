import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CharactersPager from './CharactersPager.vue'

describe('CharactersPager', () => {
  it('emits prev and next when enabled', async () => {
    const wrapper = mount(CharactersPager, { props: { page: 2, pages: 3 } })

    await wrapper.get('[data-testid="pager-prev"]').trigger('click')
    await wrapper.get('[data-testid="pager-next"]').trigger('click')

    expect(wrapper.emitted('prev')?.length).toBe(1)
    expect(wrapper.emitted('next')?.length).toBe(1)
  })

  it('disables buttons at boundaries', () => {
    const first = mount(CharactersPager, { props: { page: 1, pages: 3 } })
    expect(first.get('[data-testid="pager-prev"]').attributes('disabled')).toBeDefined()

    const last = mount(CharactersPager, { props: { page: 3, pages: 3 } })
    expect(last.get('[data-testid="pager-next"]').attributes('disabled')).toBeDefined()
  })
})
