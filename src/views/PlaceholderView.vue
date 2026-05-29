<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => String(route.meta.title ?? 'Coming soon'))
const blurb = computed(() => String(route.meta.blurb ?? ''))
</script>

<template>
  <section class="placeholder">
    <h1 class="placeholder__title">{{ title }}</h1>
    <p class="placeholder__blurb">{{ blurb }}</p>
    <p class="placeholder__hint">Use the header to jump back to the live character feed.</p>
  </section>
</template>

<style scoped>
.placeholder {
  max-width: 720px;
  margin: 0 auto;
  padding: 2.25rem 1.25rem;
  text-align: center;
}

.placeholder__title {
  margin: 0 0 0.75rem;
  font-family: var(--rm-font-display);
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  letter-spacing: 0.03em;
  color: var(--rm-text);
}

.placeholder__blurb {
  margin: 0 0 1rem;
  color: var(--rm-muted);
  line-height: 1.6;
}

.placeholder__hint {
  margin: 0;
  font-size: 0.92rem;
  color: rgb(148 163 184 / 95%);
}
</style>
