import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFavorites } from './useFavorites'

/** Favorites shortlist page: reactive items and empty state from the favourites store. */
export function useFavoritesList() {
  const store = useFavorites()
  const { items, count } = storeToRefs(store)

  const isEmpty = computed(() => count.value === 0)

  return { items, count, isEmpty }
}
