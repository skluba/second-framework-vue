<script setup lang="ts">
import type { FavoriteCharacterSnapshot } from '../types/character'
import { RouterLink } from 'vue-router'
import { useFavorites } from '../composables/useFavorites'

const props = defineProps<{
  character: FavoriteCharacterSnapshot
}>()

const favorites = useFavorites()

function onToggle(): void {
  favorites.toggle(props.character)
}
</script>

<template>
  <article class="card" data-testid="character-card">
    <RouterLink
      class="card__link"
      :to="{ name: 'character-detail', params: { id: String(character.id) } }"
    >
      <div class="card__media">
        <img
          class="card__img"
          :src="character.image"
          :alt="`Portrait of ${character.name}`"
          width="300"
          height="300"
          loading="lazy"
        />
        <span class="card__status" :data-status="character.status.toLowerCase()">{{
          character.status
        }}</span>
      </div>

      <div class="card__body">
        <h2 class="card__name">{{ character.name }}</h2>
        <p class="card__species">{{ character.species }}</p>
      </div>
    </RouterLink>

    <div class="card__actions">
      <button
        type="button"
        class="card__fav"
        :class="{ 'card__fav--on': favorites.isFavorite(character.id) }"
        :aria-pressed="favorites.isFavorite(character.id)"
        :aria-label="
          favorites.isFavorite(character.id)
            ? `Remove ${character.name} from favorites`
            : `Add ${character.name} to favorites`
        "
        data-testid="favorite-toggle"
        @click="onToggle"
      >
        {{ favorites.isFavorite(character.id) ? '★ Favorited' : '☆ Add favorite' }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--rm-border);
  background: linear-gradient(180deg, rgb(15 23 42 / 95%), rgb(2 6 23 / 92%));
  box-shadow: 0 18px 40px rgb(0 0 0 / 35%);
}

.card__link {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  text-decoration: none;
  color: inherit;
}

.card__link:focus-visible {
  outline: 2px solid rgb(190 242 100 / 75%);
  outline-offset: 2px;
}

.card__media {
  position: relative;
  aspect-ratio: 1;
  background: rgb(2 6 23 / 85%);
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card__status {
  position: absolute;
  left: 0.65rem;
  bottom: 0.65rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: 1px solid rgb(255 255 255 / 18%);
  background: rgb(2 6 23 / 72%);
  color: #e2e8f0;
}

.card__status[data-status='alive'] {
  border-color: rgb(34 197 94 / 55%);
  color: #bbf7d0;
}

.card__status[data-status='dead'] {
  border-color: rgb(248 113 113 / 55%);
  color: #fecaca;
}

.card__body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.85rem 0.95rem 0.65rem;
}

.card__name {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.25;
  color: var(--rm-text);
}

.card__species {
  margin: 0;
  font-size: 0.88rem;
  color: var(--rm-muted);
}

.card__actions {
  padding: 0 0.95rem 1rem;
}

.card__fav {
  width: 100%;
  cursor: pointer;
  border-radius: 0.65rem;
  border: 1px solid rgb(56 189 248 / 35%);
  padding: 0.5rem 0.65rem;
  font-weight: 700;
  font-size: 0.85rem;
  color: #bae6fd;
  background: rgb(2 6 23 / 55%);
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    color 0.15s ease;
}

.card__fav:hover {
  border-color: rgb(125 211 252 / 55%);
  color: #e0f2fe;
}

.card__fav--on {
  border-color: rgb(250 204 21 / 55%);
  color: #fef9c3;
  background: rgb(113 63 18 / 25%);
}
</style>
