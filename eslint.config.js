import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'node_modules/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['eslint.config.js', 'playwright.config.ts', 'vitest.config.ts', 'vite.config.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['e2e/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ['src/App.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  eslintConfigPrettier,
)
