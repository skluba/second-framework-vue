import { describe, expect, it } from 'vitest'
import { createAppRouter, routes, scrollToTop } from './index'

describe('router', () => {
  it('registers expected routes', () => {
    expect(routes.map((r) => r.path)).toEqual(['/', '/character/:id', '/favorites'])
  })

  it('scrolls to top on navigation', () => {
    expect(scrollToTop({} as never, {} as never, {} as never)).toEqual({ top: 0 })
  })

  it('creates the app router instance', () => {
    const router = createAppRouter()
    expect(router.getRoutes().length).toBeGreaterThan(0)
  })
})
