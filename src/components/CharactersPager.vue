<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  pages: number
}>()

const emit = defineEmits<{
  prev: []
  next: []
}>()

const canPrev = computed(() => props.page > 1)
const canNext = computed(() => props.page < props.pages)
</script>

<template>
  <nav class="pager" aria-label="Pagination">
    <button
      type="button"
      class="pager__btn"
      :disabled="!canPrev"
      data-testid="pager-prev"
      @click="emit('prev')"
    >
      ← Previous
    </button>

    <p class="pager__meta" data-testid="pager-meta">
      Page <strong>{{ page }}</strong> of <strong>{{ pages }}</strong>
    </p>

    <button
      type="button"
      class="pager__btn"
      :disabled="!canNext"
      data-testid="pager-next"
      @click="emit('next')"
    >
      Next →
    </button>
  </nav>
</template>

<style scoped>
.pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem 1rem;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  border: 1px solid var(--rm-border);
  background: rgb(2 6 23 / 55%);
}

.pager__meta {
  margin: 0;
  color: var(--rm-muted);
  font-size: 0.95rem;
}

.pager__meta strong {
  color: var(--rm-text);
}

.pager__btn {
  cursor: pointer;
  border-radius: 0.75rem;
  border: 1px solid rgb(56 189 248 / 35%);
  padding: 0.55rem 0.85rem;
  font-weight: 700;
  color: #bae6fd;
  background: rgb(15 23 42 / 55%);
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;
}

.pager__btn:hover:not(:disabled) {
  border-color: rgb(125 211 252 / 55%);
  color: #e0f2fe;
}

.pager__btn:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}
</style>
