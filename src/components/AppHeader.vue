<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useFavorites } from '../composables/useFavorites'

const route = useRoute()
const favorites = useFavorites()

const isCharactersActive = computed(() => route.name === 'characters')
const isDetailActive = computed(() => route.name === 'character-detail')
const isFavoritesActive = computed(() => route.name === 'favorites')
</script>

<template>
  <header class="header">
    <div class="header__brand">
      <RouterLink to="/" class="header__logo" aria-label="Home — characters catalog">
        <span class="header__portal" aria-hidden="true" />
        <div class="header__titles">
          <span class="header__title">Multiverse Catalog</span>
          <span class="header__subtitle">Rick &amp; Morty · REST index</span>
        </div>
      </RouterLink>
    </div>

    <nav class="header__nav" aria-label="Main">
      <RouterLink
        class="header__link"
        :class="{ 'header__link--active': isCharactersActive }"
        to="/"
      >
        Characters
      </RouterLink>
      <RouterLink
        class="header__link"
        :class="{ 'header__link--active': isDetailActive }"
        :to="{ name: 'character-detail', params: { id: '1' } }"
      >
        Character
      </RouterLink>
      <RouterLink
        class="header__link"
        :class="{ 'header__link--active': isFavoritesActive }"
        to="/favorites"
      >
        Favorites
      </RouterLink>
    </nav>

    <div class="header__favorites" aria-live="polite">
      <span class="header__favorites-label">Favorites</span>
      <span class="header__favorites-count" data-testid="favorites-count">{{
        favorites.count
      }}</span>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.5rem;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--rm-border);
  background: linear-gradient(
    95deg,
    rgb(15 23 42 / 92%),
    rgb(22 101 52 / 35%),
    rgb(15 23 42 / 92%)
  );
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 20;
}

.header__brand {
  display: flex;
  align-items: center;
  min-width: 0;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

.header__portal {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, #bef264, transparent 55%),
    radial-gradient(circle at 70% 65%, #22c55e, #14532d 70%);
  box-shadow:
    0 0 0 2px rgb(190 242 100 / 55%),
    0 0 18px rgb(34 197 94 / 55%);
  flex-shrink: 0;
}

.header__titles {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.header__title {
  font-family: var(--rm-font-display);
  font-size: 1.25rem;
  letter-spacing: 0.04em;
  color: var(--rm-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header__subtitle {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--rm-muted);
}

.header__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: center;
}

.header__link {
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--rm-muted);
  text-decoration: none;
  border: 1px solid transparent;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;
}

.header__link:hover {
  color: var(--rm-text);
  border-color: rgb(190 242 100 / 35%);
  background: rgb(15 23 42 / 55%);
}

.header__link--active {
  color: #ecfccb;
  border-color: rgb(190 242 100 / 55%);
  background: rgb(22 101 52 / 35%);
}

.header__favorites {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgb(56 189 248 / 35%);
  background: rgb(2 6 23 / 55%);
}

.header__favorites-label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rm-muted);
}

.header__favorites-count {
  min-width: 1.75rem;
  text-align: center;
  font-weight: 800;
  font-size: 1rem;
  color: #7dd3fc;
}
</style>
