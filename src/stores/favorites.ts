import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STORAGE_KEY = 'rm-favorite-character-ids'

function readStoredIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is number => typeof id === 'number' && Number.isFinite(id))
  } catch {
    return []
  }
}

function writeStoredIds(ids: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    /* ignore quota / private mode */
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<number[]>(readStoredIds())

  function persist(): void {
    writeStoredIds(ids.value)
  }

  const count = computed(() => ids.value.length)

  function isFavorite(id: number): boolean {
    return ids.value.includes(id)
  }

  function toggle(id: number): void {
    if (ids.value.includes(id)) {
      ids.value = ids.value.filter((x) => x !== id)
    } else {
      ids.value = [...ids.value, id]
    }
    persist()
  }

  function remove(id: number): void {
    ids.value = ids.value.filter((x) => x !== id)
    persist()
  }

  return { ids, count, isFavorite, toggle, remove }
})
