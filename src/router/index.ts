import type { RouterScrollBehavior } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import CharactersView from '../views/CharactersView.vue'
import CharacterDetailView from '../views/CharacterDetailView.vue'
import FavoritesView from '../views/FavoritesView.vue'

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
    component: FavoritesView,
    meta: { title: 'Favorite characters' },
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
