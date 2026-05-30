import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchCharacters } from '../api/rickAndMorty'
import type { CharactersResponse } from '../types/character'

/**
 * Characters catalog: URL query sync (page, name, species), debounced name search,
 * REST loading and pagination.
 */
export function useCharactersCatalog() {
  const router = useRouter()
  const route = useRoute()

  const nameDraft = ref('')
  const speciesValue = ref('')
  let nameDebounce: ReturnType<typeof setTimeout> | undefined

  const page = computed(() => {
    const raw = Number(route.query.page)
    return Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1
  })

  const nameQuery = computed(() => (typeof route.query.name === 'string' ? route.query.name : ''))
  const speciesQuery = computed(() =>
    typeof route.query.species === 'string' ? route.query.species : '',
  )

  watch(
    nameQuery,
    (value) => {
      nameDraft.value = value
    },
    { immediate: true },
  )

  watch(
    speciesQuery,
    (value) => {
      speciesValue.value = value
    },
    { immediate: true },
  )

  function replaceQuery(query: Record<string, string | string[] | undefined>): void {
    router.replace({ query }).catch(() => undefined)
  }

  function scheduleNameCommit(): void {
    clearTimeout(nameDebounce)
    nameDebounce = setTimeout(() => {
      replaceQuery({
        ...route.query,
        page: '1',
        name: nameDraft.value.trim() ? nameDraft.value.trim() : undefined,
        species: speciesValue.value ? speciesValue.value : undefined,
      })
    }, 400)
  }

  function onSpeciesInput(): void {
    replaceQuery({
      ...route.query,
      page: '1',
      name: nameQuery.value.trim() ? nameQuery.value.trim() : undefined,
      species: speciesValue.value ? speciesValue.value : undefined,
    })
  }

  const loading = ref(false)
  const errorMessage = ref<string | null>(null)
  const data = ref<CharactersResponse | null>(null)

  const characters = computed(() => data.value?.results ?? [])
  const totalPages = computed(() => data.value?.info.pages ?? 0)

  async function load(): Promise<void> {
    loading.value = true
    errorMessage.value = null
    try {
      data.value = await fetchCharacters({
        page: page.value,
        name: nameQuery.value.trim() || undefined,
        species: speciesQuery.value.trim() || undefined,
      })
    } catch (e) {
      errorMessage.value = e instanceof Error ? e.message : 'Something went wrong'
      data.value = null
    } finally {
      loading.value = false
    }
  }

  watch([page, nameQuery, speciesQuery], load, { immediate: true })

  function goPrev(): void {
    if (page.value <= 1) return
    replaceQuery({ ...route.query, page: String(page.value - 1) })
  }

  function goNext(): void {
    const pages = totalPages.value
    if (pages <= 0 || page.value >= pages) return
    replaceQuery({ ...route.query, page: String(page.value + 1) })
  }

  return {
    nameDraft,
    speciesValue,
    page,
    scheduleNameCommit,
    onSpeciesInput,
    loading,
    errorMessage,
    characters,
    totalPages,
    load,
    goPrev,
    goNext,
  }
}
