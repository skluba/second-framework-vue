<script setup lang="ts">
import { computed } from 'vue'
import CharacterCard from '../components/CharacterCard.vue'
import { useFavoritesStore } from '../stores/favorites'

const favorites = useFavoritesStore()

const isEmpty = computed(() => favorites.count === 0)
</script>

<template>
  <div class="favorites">
    <section class="favorites__hero" aria-labelledby="favorites-hero-title">
      <p class="favorites__eyebrow">Phase 3 · Shortlist</p>
      <h1 id="favorites-hero-title" class="favorites__title" data-testid="page-title">
        Favorite characters
      </h1>
      <p class="favorites__lede">
        Cards you bookmark from the catalog or dossier — stored in this browser’s
        <strong>local storage</strong>, no filters and no pagination.
      </p>
    </section>

    <p v-if="isEmpty" class="state" data-testid="favorites-empty">no cards</p>

    <ul v-else class="grid" data-testid="favorites-grid">
      <li v-for="c in favorites.items" :key="c.id" class="grid__item">
        <CharacterCard :character="c" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.favorites {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.favorites__hero {
  padding: 1.1rem 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--rm-border);
  background:
    radial-gradient(circle at 18% 22%, rgb(250 204 21 / 14%), transparent 42%),
    radial-gradient(circle at 82% 12%, rgb(56 189 248 / 14%), transparent 38%),
    rgb(2 6 23 / 55%);
}

.favorites__eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--rm-muted);
}

.favorites__title {
  margin: 0;
  font-family: var(--rm-font-display);
  font-size: clamp(1.75rem, 4vw, 2.35rem);
  letter-spacing: 0.03em;
  color: var(--rm-text);
}

.favorites__lede {
  margin: 0.6rem 0 0;
  max-width: 62ch;
  color: var(--rm-muted);
  line-height: 1.55;
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
</style>
