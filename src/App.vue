<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="shell">
    <AppHeader />
    <main class="shell__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: var(--rm-text);
}

.shell__main {
  flex: 1;
}
</style>
