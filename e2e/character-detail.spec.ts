import { expect, test } from '@playwright/test'

test.describe('Character detail', () => {
  test('shows dossier for Rick (id 1)', async ({ page }) => {
    await page.goto('/character/1')

    await expect(page.getByTestId('character-dossier')).toBeVisible({ timeout: 20_000 })
    await expect(page.getByRole('heading', { level: 1, name: 'Rick Sanchez' })).toBeVisible()
    await expect(page.getByTestId('first-episode')).not.toHaveText('Unknown')
  })
})
