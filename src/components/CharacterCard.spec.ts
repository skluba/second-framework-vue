import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Character } from '../types/character'
import CharacterCard from './CharacterCard.vue'

const sample: Character = {
  id: 99,
  name: 'Test Rick',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'https://example.com/avatar.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: '',
  created: '',
}

describe('CharacterCard', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(async () => {
    localStorage.clear()
    setActivePinia(createPinia())
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/character/:id', name: 'character-detail', component: { template: '<div />' } },
      ],
    })
    await router.push('/')
  })

  it('renders character fields and toggles favorite label', async () => {
    const wrapper = mount(CharacterCard, {
      props: { character: sample },
      global: { plugins: [router] },
    })

    expect(wrapper.get('[data-testid="character-card"]').text()).toContain('Test Rick')
    expect(wrapper.get('[data-testid="character-card"]').text()).toContain('Human')
    expect(wrapper.get('a.card__link').attributes('href')).toContain('/character/99')

    const btn = wrapper.get('[data-testid="favorite-toggle"]')
    expect(btn.text()).toContain('Add favorite')

    await btn.trigger('click')
    expect(btn.text()).toContain('Favorited')

    await btn.trigger('click')
    expect(btn.text()).toContain('Add favorite')
  })
})
