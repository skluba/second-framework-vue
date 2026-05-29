<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment(): void {
  count.value += 1
}
</script>

<template>
  <div class="app">
    <header class="app__header">
      <h1>Second Framework</h1>
      <p class="app__tagline">Vue 3 + TypeScript + Vite</p>
    </header>
    <main class="app__main">
      <button type="button" class="counter" data-testid="counter" @click="increment">
        Count is {{ count }}
      </button>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  font-family:
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  color: #0f172a;
  background: linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%);
}

.app__header {
  text-align: center;
}

.app__header h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.app__tagline {
  margin: 0.35rem 0 0;
  color: #64748b;
  font-size: 0.95rem;
}

.app__main {
  display: flex;
  justify-content: center;
}

.counter {
  cursor: pointer;
  border: none;
  border-radius: 0.5rem;
  padding: 0.65rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #2563eb;
  box-shadow: 0 4px 14px rgb(37 99 235 / 35%);
  transition:
    transform 0.12s ease,
    background 0.12s ease;
}

.counter:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.counter:active {
  transform: translateY(0);
}
</style>
