import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCharacterById, fetchEpisodeById } from '../api/rickAndMorty'
import { useFavorites } from './useFavorites'
import type { Character } from '../types/character'
import { getFirstSeenEpisodeId } from '../utils/firstSeenEpisode'

/**
 * Single-character dossier: route id, REST load, first-seen episode resolution, favourite toggle.
 */
export function useCharacterDossier() {
  const route = useRoute()
  const favorites = useFavorites()

  const loading = ref(true)
  const errorMessage = ref<string | null>(null)
  const character = ref<Character | null>(null)
  const firstEpisodeName = ref<string | null>(null)
  const firstEpisodeLoading = ref(false)

  function parseRouteId(): number | null {
    const raw = route.params.id
    const v = Array.isArray(raw) ? raw[0] : raw
    const n = Number(v)
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : null
  }

  async function load(id: number): Promise<void> {
    loading.value = true
    errorMessage.value = null
    character.value = null
    firstEpisodeName.value = null
    firstEpisodeLoading.value = false

    try {
      const c = await fetchCharacterById(id)
      character.value = c

      const epId = getFirstSeenEpisodeId(c)
      if (epId === null) {
        firstEpisodeName.value = null
        return
      }

      firstEpisodeLoading.value = true
      try {
        const ep = await fetchEpisodeById(epId)
        firstEpisodeName.value = ep.name
      } catch {
        firstEpisodeName.value = 'Unavailable'
      } finally {
        firstEpisodeLoading.value = false
      }
    } catch (e) {
      errorMessage.value = e instanceof Error ? e.message : 'Failed to load character'
    } finally {
      loading.value = false
    }
  }

  watch(
    () => route.params.id,
    async () => {
      const id = parseRouteId()
      if (id === null) {
        loading.value = false
        errorMessage.value = 'Invalid character id'
        character.value = null
        firstEpisodeName.value = null
        return
      }
      await load(id)
    },
    { immediate: true },
  )

  const locationLabel = computed(() => character.value?.location?.name?.trim() || 'Unknown')

  const firstSeenLabel = computed(() => {
    if (firstEpisodeLoading.value) return 'Loading…'
    if (firstEpisodeName.value) return firstEpisodeName.value
    if (character.value?.episode?.length === 0) return 'No episode data'
    return 'Unknown'
  })

  function onToggleFavorite(): void {
    if (!character.value) return
    favorites.toggle(character.value)
  }

  return {
    loading,
    errorMessage,
    character,
    locationLabel,
    firstSeenLabel,
    favorites,
    onToggleFavorite,
  }
}
