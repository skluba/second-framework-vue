import { useFavoritesStore } from '../stores/favorites'

/**
 * Application entry point for favourite bookmarks (Pinia + localStorage).
 * Prefer this over importing the store directly from UI components.
 */
export function useFavorites() {
  return useFavoritesStore()
}
