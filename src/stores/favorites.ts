import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { FavoriteCharacterSnapshot } from '../types/character'

/** Current format: array of card snapshots (Phase 3). */
export const FAVORITES_STORAGE_KEY = 'rm-favorite-characters'
/** Phase 1–2: numeric ids only — migrated away on read (cards need stored fields). */
export const FAVORITES_LEGACY_IDS_STORAGE_KEY = 'rm-favorite-character-ids'

function isValidSnapshot(x: unknown): x is FavoriteCharacterSnapshot {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'number' &&
    Number.isFinite(o.id) &&
    typeof o.name === 'string' &&
    typeof o.species === 'string' &&
    typeof o.status === 'string' &&
    typeof o.image === 'string'
  )
}

function pickSnapshot(char: FavoriteCharacterSnapshot): FavoriteCharacterSnapshot {
  return {
    id: char.id,
    name: char.name,
    species: char.species,
    status: char.status,
    image: char.image,
  }
}

function dedupeById(list: FavoriteCharacterSnapshot[]): FavoriteCharacterSnapshot[] {
  const seen = new Set<number>()
  const out: FavoriteCharacterSnapshot[] = []
  for (const c of list) {
    if (seen.has(c.id)) continue
    seen.add(c.id)
    out.push(c)
  }
  return out
}

function readStored(): FavoriteCharacterSnapshot[] {
  try {
    const rawChars = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (rawChars) {
      const parsed: unknown = JSON.parse(rawChars)
      if (!Array.isArray(parsed)) return []
      return dedupeById(parsed.filter(isValidSnapshot))
    }

    const rawLegacy = localStorage.getItem(FAVORITES_LEGACY_IDS_STORAGE_KEY)
    if (rawLegacy !== null) {
      localStorage.removeItem(FAVORITES_LEGACY_IDS_STORAGE_KEY)
    }
  } catch {
    return []
  }
  return []
}

function writeStored(items: FavoriteCharacterSnapshot[]): void {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* ignore quota / private mode */
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref<FavoriteCharacterSnapshot[]>(readStored())

  function persist(): void {
    writeStored(items.value)
  }

  const count = computed(() => items.value.length)

  function isFavorite(id: number): boolean {
    return items.value.some((c) => c.id === id)
  }

  function toggle(char: FavoriteCharacterSnapshot): void {
    const id = char.id
    if (items.value.some((c) => c.id === id)) {
      items.value = items.value.filter((c) => c.id !== id)
    } else {
      items.value = [...items.value, pickSnapshot(char)]
    }
    persist()
  }

  function remove(id: number): void {
    items.value = items.value.filter((c) => c.id !== id)
    persist()
  }

  return { items, count, isFavorite, toggle, remove }
})
