import { mount, flushPromises } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Character } from '../types/character'
import CharactersView from './CharactersView.vue'

function makeCharacter(id: number, name: string): Character {
  return {
    id,
    name,
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'https://example.com/a.jpeg',
    episode: [],
    url: '',
    created: '',
  }
}

describe('CharactersView', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        info: { count: 40, pages: 2, next: 'https://next', prev: null },
        results: [makeCharacter(1, 'Rick')],
      }),
    }))
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('loads characters and paginates', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'characters', component: CharactersView }],
    })

    await router.push('/')
    await router.isReady()

    const pinia = createPinia()
    const wrapper = mount(CharactersView, { global: { plugins: [pinia, router] } })

    await flushPromises()
    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="character-card"]').exists()).toBe(true)
    })

    await router.push({ path: '/', query: { page: '2' } })
    await flushPromises()

    const urls = fetchMock.mock.calls.map((c) => String(c[0]))
    expect(urls.some((u) => u.includes('page=2'))).toBe(true)
  })

  it('shows an error and retries', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'characters', component: CharactersView }],
    })
    await router.push('/')
    await router.isReady()

    const pinia = createPinia()
    const wrapper = mount(CharactersView, { global: { plugins: [pinia, router] } })
    await flushPromises()

    expect(wrapper.text()).toContain('Request failed: 500')

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [makeCharacter(2, 'Morty')],
      }),
    })

    await wrapper.get('[data-testid="retry"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="character-card"]').exists()).toBe(true)
  })

  it('debounces name search and applies species filter', async () => {
    vi.useFakeTimers()

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'characters', component: CharactersView }],
    })
    await router.push('/')
    await router.isReady()

    const pinia = createPinia()
    const wrapper = mount(CharactersView, { global: { plugins: [pinia, router] } })
    await flushPromises()
    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="filter-name"]').exists()).toBe(true)
    })

    await wrapper.get('[data-testid="filter-name"]').setValue('pickle')
    await vi.advanceTimersByTimeAsync(450)
    await flushPromises()

    const urlsAfterName = fetchMock.mock.calls.map((c) => String(c[0]))
    expect(urlsAfterName.some((u) => u.includes('name=pickle'))).toBe(true)

    await wrapper.get('[data-testid="filter-species"]').setValue('Human')
    await flushPromises()

    const urlsAfterSpecies = fetchMock.mock.calls.map((c) => String(c[0]))
    expect(urlsAfterSpecies.some((u) => u.includes('species=Human'))).toBe(true)

    vi.useRealTimers()
  })

  it('shows empty state when API returns no matches', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ error: 'There is nothing here' }),
    })

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'characters', component: CharactersView }],
    })
    await router.push('/')
    await router.isReady()

    const pinia = createPinia()
    const wrapper = mount(CharactersView, { global: { plugins: [pinia, router] } })
    await flushPromises()

    expect(wrapper.text()).toContain('No characters in this slice')
  })
})
