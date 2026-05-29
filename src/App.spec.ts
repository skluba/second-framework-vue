import { mount, flushPromises } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.vue'
import { routes } from './router'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          info: { count: 1, pages: 1, next: null, prev: null },
          results: [
            {
              id: 1,
              name: 'Rick Sanchez',
              status: 'Alive',
              species: 'Human',
              type: '',
              gender: 'Male',
              origin: { name: 'Earth (C-137)', url: '' },
              location: { name: 'Citadel of Ricks', url: '' },
              image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
              episode: [],
              url: '',
              created: '',
            },
          ],
        }),
      })) as unknown as typeof fetch,
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders shell and characters catalog', async () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Multiverse Catalog')
    expect(wrapper.get('[data-testid="page-title"]').text()).toBe('Characters')
    expect(wrapper.get('[data-testid="favorites-count"]').text()).toBe('0')
    expect(wrapper.find('[data-testid="character-card"]').exists()).toBe(true)
  })
})
