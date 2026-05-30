import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import type { FavoriteCharacterSnapshot } from '../types/character'
import {
  FAVORITES_LEGACY_IDS_STORAGE_KEY,
  FAVORITES_STORAGE_KEY,
  useFavoritesStore,
} from './favorites'

const morty: FavoriteCharacterSnapshot = {
  id: 2,
  name: 'Morty Smith',
  species: 'Human',
  status: 'Alive',
  image: 'https://example.com/morty.jpg',
}

describe('favorites store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('toggles snapshots and persists JSON to localStorage', () => {
    const store = useFavoritesStore()

    expect(store.count).toBe(0)
    store.toggle(morty)
    expect(store.isFavorite(2)).toBe(true)
    expect(store.count).toBe(1)
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]')).toEqual([morty])

    store.remove(2)
    expect(store.isFavorite(2)).toBe(false)
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]')).toEqual([])

    store.toggle(morty)
    expect(store.isFavorite(2)).toBe(true)

    store.toggle(morty)
    expect(store.isFavorite(2)).toBe(false)
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]')).toEqual([])
  })

  it('loads initial snapshots from localStorage', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([morty]))
    const store = useFavoritesStore()

    expect(store.items).toEqual([morty])
    expect(store.count).toBe(1)
  })

  it('drops legacy id-only storage and starts empty', () => {
    localStorage.setItem(FAVORITES_LEGACY_IDS_STORAGE_KEY, JSON.stringify([2, 5]))
    const store = useFavoritesStore()

    expect(store.count).toBe(0)
    expect(localStorage.getItem(FAVORITES_LEGACY_IDS_STORAGE_KEY)).toBeNull()
  })

  it('ignores invalid JSON entries when loading', () => {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify([
        morty,
        { id: 'bad', name: 'x', species: 'y', status: 'z', image: 'u' },
        { id: 3, name: 'Rick', species: 'Human', status: 'Alive', image: 'https://x' },
      ]),
    )
    const store = useFavoritesStore()

    expect(store.items).toHaveLength(2)
    expect(store.items.map((c) => c.id)).toEqual([2, 3])
  })
})
