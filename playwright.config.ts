import { defineConfig, devices } from '@playwright/test'

const port = 4173
const baseURL = `http://127.0.0.1:${port}`

/** CI runs `npm run build` before e2e; locally we build so preview is never stale. */
const previewCommand =
  process.env.CI === 'true'
    ? `npm run preview -- --host 127.0.0.1 --port ${port}`
    : `npm run build && npm run preview -- --host 127.0.0.1 --port ${port}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ['html', { open: 'never' }],
        ['github'],
        ['junit', { outputFile: 'test-results/e2e-junit.xml' }],
      ]
    : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: previewCommand,
    url: baseURL,
    /** Always start our preview so `command` runs (local `build && preview` is not skipped by reuse). */
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
