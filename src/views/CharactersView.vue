<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchCharacters } from '../api/rickAndMorty'
import CharacterCard from '../components/CharacterCard.vue'
import CharactersPager from '../components/CharactersPager.vue'
import { SPECIES_FILTER_OPTIONS } from '../constants/speciesFilters'
import type { CharactersResponse } from '../types/character'

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

function scheduleNameCommit(): void {
  clearTimeout(nameDebounce)
  nameDebounce = setTimeout(() => {
    void router.replace({
      query: {
        ...route.query,
        page: '1',
        name: nameDraft.value.trim() ? nameDraft.value.trim() : undefined,
        species: speciesValue.value ? speciesValue.value : undefined,
      },
    })
  }, 400)
}

function onSpeciesInput(): void {
  void router.replace({
    query: {
      ...route.query,
      page: '1',
      name: nameQuery.value.trim() ? nameQuery.value.trim() : undefined,
      species: speciesValue.value ? speciesValue.value : undefined,
    },
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
  void router.replace({ query: { ...route.query, page: String(page.value - 1) } })
}

function goNext(): void {
  const pages = totalPages.value
  if (pages <= 0 || page.value >= pages) return
  void router.replace({ query: { ...route.query, page: String(page.value + 1) } })
}
</script>

<template>
  <div class="characters">
    <section class="characters__hero" aria-labelledby="characters-hero-title">
      <p class="characters__eyebrow">Phase 1 · Dimension index</p>
      <h1 id="characters-hero-title" class="characters__title" data-testid="page-title">
        Characters
      </h1>
      <p class="characters__lede">
        Pulled live from The Rick and Morty API REST catalog — filter, search, and bookmark whoever
        survives the pagination gauntlet.
      </p>
    </section>

    <section class="filters" aria-label="Filters">
      <div class="filters__grid">
        <label class="field">
          <span class="field__label">Search by name</span>
          <input
            v-model="nameDraft"
            class="field__input"
            type="search"
            name="name"
            placeholder="e.g. Rick, Morty, Pickle…"
            autocomplete="off"
            data-testid="filter-name"
            @input="scheduleNameCommit"
          />
        </label>

        <label class="field">
          <span class="field__label">Filter by species</span>
          <select
            v-model="speciesValue"
            class="field__input field__input--select"
            data-testid="filter-species"
            @change="onSpeciesInput"
          >
            <option v-for="opt in SPECIES_FILTER_OPTIONS" :key="opt.label" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </label>
      </div>
    </section>

    <p v-if="loading" class="state state--loading" role="status">
      Opening portal… loading characters.
    </p>
    <p v-else-if="errorMessage" class="state state--error" role="alert">
      {{ errorMessage }}
      <button type="button" class="state__retry" data-testid="retry" @click="load">Retry</button>
    </p>
    <p v-else-if="characters.length === 0" class="state" role="status">
      No characters in this slice of the multiverse. Try another name or species.
    </p>

    <ul v-else class="grid" data-testid="character-grid">
      <li v-for="c in characters" :key="c.id" class="grid__item">
        <CharacterCard :character="c" />
      </li>
    </ul>

    <CharactersPager
      v-if="!loading && !errorMessage && totalPages > 0"
      :page="page"
      :pages="totalPages"
      @prev="goPrev"
      @next="goNext"
    />
  </div>
</template>

<style scoped>
.characters {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.characters__hero {
  padding: 1.1rem 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--rm-border);
  background:
    radial-gradient(circle at 20% 20%, rgb(34 197 94 / 18%), transparent 45%),
    radial-gradient(circle at 80% 10%, rgb(56 189 248 / 16%), transparent 40%), rgb(2 6 23 / 55%);
}

.characters__eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--rm-muted);
}

.characters__title {
  margin: 0;
  font-family: var(--rm-font-display);
  font-size: clamp(1.75rem, 4vw, 2.35rem);
  letter-spacing: 0.03em;
  color: var(--rm-text);
}

.characters__lede {
  margin: 0.6rem 0 0;
  max-width: 62ch;
  color: var(--rm-muted);
  line-height: 1.55;
}

.filters {
  border-radius: 1rem;
  border: 1px solid var(--rm-border);
  background: rgb(15 23 42 / 45%);
  padding: 1rem;
}

.filters__grid {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field__label {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rm-muted);
}

.field__input {
  border-radius: 0.75rem;
  border: 1px solid rgb(56 189 248 / 28%);
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
  color: var(--rm-text);
  background: rgb(2 6 23 / 65%);
  outline: none;
}

.field__input:focus-visible {
  border-color: rgb(190 242 100 / 55%);
  box-shadow: 0 0 0 3px rgb(190 242 100 / 18%);
}

.field__input--select {
  cursor: pointer;
}

.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.grid__item {
  min-width: 0;
}

.state {
  margin: 0;
  padding: 1rem 1.05rem;
  border-radius: 1rem;
  border: 1px dashed rgb(148 163 184 / 35%);
  color: var(--rm-muted);
}

.state--loading {
  border-style: solid;
  border-color: rgb(56 189 248 / 35%);
}

.state--error {
  border-style: solid;
  border-color: rgb(248 113 113 / 45%);
  color: #fecaca;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
}

.state__retry {
  cursor: pointer;
  border-radius: 0.65rem;
  border: 1px solid rgb(248 113 113 / 55%);
  padding: 0.45rem 0.75rem;
  font-weight: 800;
  color: #fee2e2;
  background: rgb(127 29 29 / 35%);
}
</style>
