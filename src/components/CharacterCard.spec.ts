import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import CharacterCard from './CharacterCard.vue'
import type { Character } from '../types/character'

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
  episode: [],
  url: '',
  created: '',
}

describe('CharacterCard', () => {
  it('renders character fields and toggles favorite label', async () => {
    setActivePinia(createPinia())
    const wrapper = mount(CharacterCard, { props: { character: sample } })

    expect(wrapper.get('[data-testid="character-card"]').text()).toContain('Test Rick')
    expect(wrapper.get('[data-testid="character-card"]').text()).toContain('Human')

    const btn = wrapper.get('[data-testid="favorite-toggle"]')
    expect(btn.text()).toContain('Add favorite')

    await btn.trigger('click')
    expect(btn.text()).toContain('Favorited')

    await btn.trigger('click')
    expect(btn.text()).toContain('Add favorite')
  })
})
