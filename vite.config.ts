import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/** GitHub project Pages lives under `/<repo>/`; local dev uses `/`. */
function normalizeBase(raw: string | undefined): string {
  const v = (raw ?? '/').trim()
  if (v === '' || v === '/') return '/'
  const withLeading = v.startsWith('/') ? v : `/${v}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}

// https://vite.dev/config/
export default defineConfig({
  base: normalizeBase(process.env.VITE_BASE_URL),
  plugins: [vue()],
})
