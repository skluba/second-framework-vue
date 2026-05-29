import { mount, flushPromises } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Character } from '../types/character'
import CharacterDetailView from './CharacterDetailView.vue'

const rick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [
    'https://rickandmortyapi.com/api/episode/10',
    'https://rickandmortyapi.com/api/episode/3',
  ],
  url: '',
  created: '',
}

describe('CharacterDetailView', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads character and first-seen episode name', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const u = typeof input === 'string' ? input : input.toString()
      if (/\/api\/character\/1$/.test(u)) {
        return { ok: true, json: async () => rick }
      }
      if (/\/api\/episode\/3$/.test(u)) {
        return { ok: true, json: async () => ({ id: 3, name: 'Anatomy Park' }) }
      }
      return { ok: false, status: 404, json: async () => ({}) }
    })
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch)

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'characters', component: { template: '<div />' } },
        { path: '/character/:id', name: 'character-detail', component: CharacterDetailView },
      ],
    })
    await router.push('/character/1')
    await router.isReady()

    const pinia = createPinia()
    const wrapper = mount(CharacterDetailView, { global: { plugins: [pinia, router] } })

    await flushPromises()
    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="character-dossier"]').exists()).toBe(true)
    })

    expect(wrapper.text()).toContain('Rick Sanchez')
    expect(wrapper.text()).toContain('Citadel of Ricks')
    expect(wrapper.get('[data-testid="first-episode"]').text()).toContain('Anatomy Park')
  })

  it('shows invalid id message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 404,
        json: async () => ({}),
      })) as unknown as typeof fetch,
    )

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'characters', component: { template: '<div />' } },
        { path: '/character/:id', name: 'character-detail', component: CharacterDetailView },
      ],
    })
    await router.push('/character/nope')
    await router.isReady()

    const pinia = createPinia()
    const wrapper = mount(CharacterDetailView, { global: { plugins: [pinia, router] } })
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid character id')
  })

  it('shows Unavailable when first episode request fails', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const u = typeof input === 'string' ? input : input.toString()
      if (/\/api\/character\/1$/.test(u)) {
        return { ok: true, json: async () => rick }
      }
      if (/\/api\/episode\/3$/.test(u)) {
        return { ok: false, status: 500, json: async () => ({}) }
      }
      return { ok: false, status: 404, json: async () => ({}) }
    })
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch)

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'characters', component: { template: '<div />' } },
        { path: '/character/:id', name: 'character-detail', component: CharacterDetailView },
      ],
    })
    await router.push('/character/1')
    await router.isReady()

    const pinia = createPinia()
    const wrapper = mount(CharacterDetailView, { global: { plugins: [pinia, router] } })
    await flushPromises()
    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="character-dossier"]').exists()).toBe(true)
    })

    expect(wrapper.get('[data-testid="first-episode"]').text()).toContain('Unavailable')
  })
})
