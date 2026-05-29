import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{spec,test}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      exclude: [
        'src/main.ts',
        'src/vite-env.d.ts',
        'src/types/**',
        '**/*.d.ts',
        'src/test/**',
        '**/*.spec.ts',
        '**/*.config.*',
        'e2e/**',
        'dist/**',
      ],
    },
    reporters: ['default', ['junit', { outputFile: './test-results/vitest-junit.xml' }]],
  },
})
