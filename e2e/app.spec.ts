import { expect, test } from '@playwright/test'

test.describe('App', () => {
  test('shows characters catalog from live API', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('link', { name: /Home — characters catalog/i })).toBeVisible()
    await expect(page.getByTestId('page-title')).toHaveText('Characters')
    await expect(page.getByTestId('character-card').first()).toBeVisible({ timeout: 20_000 })
    await expect(page.getByTestId('favorites-count')).toHaveText('0')
  })
})
