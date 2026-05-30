<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { fetchCharacterById, fetchEpisodeById } from '../api/rickAndMorty'
import { useFavoritesStore } from '../stores/favorites'
import type { Character } from '../types/character'
import { getFirstSeenEpisodeId } from '../utils/firstSeenEpisode'

const route = useRoute()
const favorites = useFavoritesStore()

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
  if (character.value && character.value.episode.length === 0) return 'No episode data'
  return 'Unknown'
})

function onToggleFavorite(): void {
  if (!character.value) return
  favorites.toggle(character.value)
}
</script>

<template>
  <div class="detail">
    <nav class="detail__crumb" aria-label="Breadcrumb">
      <RouterLink class="detail__back" to="/">← Characters</RouterLink>
    </nav>

    <output v-if="loading" class="state state--loading" aria-live="polite">
      Locking onto subject…
    </output>

    <div v-else-if="errorMessage" class="state state--error" role="alert">
      {{ errorMessage }}
    </div>

    <article v-else-if="character" class="dossier" data-testid="character-dossier">
      <div class="dossier__media">
        <img
          class="dossier__img"
          :src="character.image"
          :alt="`Portrait of ${character.name}`"
          width="300"
          height="300"
        />
        <span class="dossier__status" :data-status="character.status.toLowerCase()">{{
          character.status
        }}</span>
      </div>

      <div class="dossier__body">
        <h1 class="dossier__name">{{ character.name }}</h1>
        <dl class="dossier__facts">
          <div class="fact">
            <dt class="fact__label">Species</dt>
            <dd class="fact__value">{{ character.species }}</dd>
          </div>
          <div class="fact">
            <dt class="fact__label">Status</dt>
            <dd class="fact__value">{{ character.status }}</dd>
          </div>
          <div class="fact">
            <dt class="fact__label">Last known location</dt>
            <dd class="fact__value">{{ locationLabel }}</dd>
          </div>
          <div class="fact">
            <dt class="fact__label">First seen in</dt>
            <dd class="fact__value" data-testid="first-episode">{{ firstSeenLabel }}</dd>
          </div>
        </dl>

        <button
          type="button"
          class="dossier__fav"
          :class="{ 'dossier__fav--on': favorites.isFavorite(character.id) }"
          :aria-pressed="favorites.isFavorite(character.id)"
          data-testid="detail-favorite-toggle"
          @click="onToggleFavorite"
        >
          {{ favorites.isFavorite(character.id) ? 'Remove from favourites' : 'Add to favourites' }}
        </button>
      </div>
    </article>
  </div>
</template>

<style scoped>
.detail {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.25rem 1.25rem 2.5rem;
}

.detail__crumb {
  margin-bottom: 1rem;
}

.detail__back {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 700;
  color: #bae6fd;
  text-decoration: none;
}

.detail__back:hover {
  text-decoration: underline;
}

.state {
  margin: 0;
  padding: 1rem 1.05rem;
  border-radius: 1rem;
  border: 1px dashed rgb(148 163 184 / 35%);
  color: var(--rm-muted);
}

output.state {
  display: block;
}

.state--loading {
  border-style: solid;
  border-color: rgb(56 189 248 / 35%);
}

.state--error {
  border-style: solid;
  border-color: rgb(248 113 113 / 45%);
  color: #fecaca;
}

.dossier {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(220px, 320px) 1fr;
  align-items: start;
}

@media (max-width: 720px) {
  .dossier {
    grid-template-columns: 1fr;
  }
}

.dossier__media {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--rm-border);
  background: rgb(2 6 23 / 85%);
}

.dossier__img {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 1;
  object-fit: cover;
}

.dossier__status {
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: 1px solid rgb(255 255 255 / 18%);
  background: rgb(2 6 23 / 72%);
  color: #e2e8f0;
}

.dossier__status[data-status='alive'] {
  border-color: rgb(34 197 94 / 55%);
  color: #bbf7d0;
}

.dossier__status[data-status='dead'] {
  border-color: rgb(248 113 113 / 55%);
  color: #fecaca;
}

.dossier__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dossier__name {
  margin: 0;
  font-family: var(--rm-font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  letter-spacing: 0.03em;
  color: var(--rm-text);
}

.dossier__facts {
  margin: 0;
  display: grid;
  gap: 0.85rem;
}

.fact {
  margin: 0;
  padding: 0.75rem 0.85rem;
  border-radius: 0.85rem;
  border: 1px solid rgb(148 163 184 / 22%);
  background: rgb(15 23 42 / 45%);
}

.fact__label {
  margin: 0 0 0.25rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rm-muted);
}

.fact__value {
  margin: 0;
  font-size: 1.05rem;
  color: var(--rm-text);
}

.dossier__fav {
  cursor: pointer;
  align-self: flex-start;
  border-radius: 0.75rem;
  border: 1px solid rgb(56 189 248 / 35%);
  padding: 0.65rem 1rem;
  font-weight: 800;
  font-size: 0.95rem;
  color: #bae6fd;
  background: rgb(2 6 23 / 55%);
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background 0.15s ease;
}

.dossier__fav:hover {
  border-color: rgb(125 211 252 / 55%);
  color: #e0f2fe;
}

.dossier__fav--on {
  border-color: rgb(250 204 21 / 55%);
  color: #fef9c3;
  background: rgb(113 63 18 / 25%);
}
</style>
