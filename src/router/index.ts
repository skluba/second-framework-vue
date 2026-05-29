import type { RouterScrollBehavior } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import CharactersView from '../views/CharactersView.vue'
import CharacterDetailView from '../views/CharacterDetailView.vue'
import PlaceholderView from '../views/PlaceholderView.vue'

export const routes = [
  {
    path: '/',
    name: 'characters',
    component: CharactersView,
    meta: { title: 'Characters' },
  },
  {
    path: '/character/:id',
    name: 'character-detail',
    component: CharacterDetailView,
    meta: { title: 'Character dossier' },
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: PlaceholderView,
    meta: {
      title: 'Favorite characters',
      blurb: 'Phase 3 — your interdimensional shortlist will appear here.',
    },
  },
]

export const scrollToTop: RouterScrollBehavior = () => ({ top: 0 })

export function createAppRouter() {
  return createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: scrollToTop,
  })
}
