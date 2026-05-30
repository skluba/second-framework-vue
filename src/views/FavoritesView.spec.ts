import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it } from 'vitest'
import type { FavoriteCharacterSnapshot } from '../types/character'
import { FAVORITES_STORAGE_KEY } from '../stores/favorites'
import FavoritesView from './FavoritesView.vue'

const rick: FavoriteCharacterSnapshot = {
  id: 1,
  name: 'Rick Sanchez',
  species: 'Human',
  status: 'Alive',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
}

const testRoutes = [
  { path: '/favorites', name: 'favorites', component: FavoritesView },
  { path: '/character/:id', name: 'character-detail', component: { template: '<div />' } },
]

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: testRoutes,
  })
}

describe('FavoritesView', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('shows no cards when the store is empty', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createTestRouter()
    await router.push('/favorites')
    await router.isReady()

    const wrapper = mount(FavoritesView, {
      global: { plugins: [pinia, router] },
    })

    expect(wrapper.get('[data-testid="favorites-empty"]').text()).toBe('no cards')
    expect(wrapper.find('[data-testid="favorites-grid"]').exists()).toBe(false)
  })

  it('renders a grid of stored favorite cards', async () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([rick]))
    const pinia = createPinia()
    setActivePinia(pinia)

    const router = createTestRouter()
    await router.push('/favorites')
    await router.isReady()

    const wrapper = mount(FavoritesView, {
      global: { plugins: [pinia, router] },
    })

    expect(wrapper.find('[data-testid="favorites-empty"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="favorites-grid"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="character-card"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Rick Sanchez')
  })
})
