import { expect, test } from '@playwright/test'

test.describe('Favorites', () => {
  test('empty favorites page shows no cards', async ({ page }) => {
    await page.goto('/favorites')
    await expect(page.getByTestId('favorites-empty')).toHaveText('no cards')
  })

  test('favoriting from catalog then opening favorites lists the card', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('character-card').first()).toBeVisible({ timeout: 20_000 })

    await page.getByTestId('favorite-toggle').first().click()
    await expect(page.getByTestId('favorites-count')).toHaveText('1')

    await page.goto('/favorites')
    await expect(page.getByTestId('favorites-grid')).toBeVisible()
    await expect(page.getByTestId('character-card').first()).toBeVisible()
    await expect(page.getByTestId('favorites-empty')).toHaveCount(0)
  })
})
