import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFavoritesStore } from './favorites'

const STORAGE_KEY = 'rm-favorite-character-ids'

describe('favorites store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('toggles ids and persists to localStorage', () => {
    const store = useFavoritesStore()

    expect(store.count).toBe(0)
    store.toggle(7)
    expect(store.isFavorite(7)).toBe(true)
    expect(store.count).toBe(1)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')).toEqual([7])

    store.remove(7)
    expect(store.isFavorite(7)).toBe(false)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')).toEqual([])

    store.toggle(7)
    expect(store.isFavorite(7)).toBe(true)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')).toEqual([7])

    store.toggle(7)
    expect(store.isFavorite(7)).toBe(false)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')).toEqual([])
  })

  it('loads initial ids from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([2, 5]))
    const store = useFavoritesStore()

    expect(store.ids).toEqual([2, 5])
    expect(store.count).toBe(2)
  })
})
