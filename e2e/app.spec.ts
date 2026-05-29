import { expect, test } from '@playwright/test'

test.describe('App', () => {
  test('shows heading and increments counter', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Second Framework' })).toBeVisible()
    const counter = page.getByTestId('counter')
    await expect(counter).toHaveText('Count is 0')

    await counter.click()
    await expect(counter).toHaveText('Count is 1')
  })
})
