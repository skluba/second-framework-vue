import { describe, expect, it, vi } from 'vitest'
import { fetchCharacters } from './rickAndMorty'

describe('fetchCharacters', () => {
  it('returns parsed results on success', async () => {
    const payload = {
      info: { count: 2, pages: 1, next: null, prev: null },
      results: [{ id: 1, name: 'Rick' }],
    }

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => payload,
      })) as unknown as typeof fetch,
    )

    await expect(fetchCharacters({ page: 1, name: 'rick' })).resolves.toEqual(payload)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/character/?'))
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('page=1'))
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('name=rick'))

    vi.unstubAllGlobals()
  })

  it('returns empty results when API responds with error object', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ error: 'There is nothing here' }),
      })) as unknown as typeof fetch,
    )

    await expect(fetchCharacters({ page: 1, species: 'Nope' })).resolves.toEqual({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    })

    vi.unstubAllGlobals()
  })

  it('throws when HTTP status is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 500,
        json: async () => ({}),
      })) as unknown as typeof fetch,
    )

    await expect(fetchCharacters({ page: 1 })).rejects.toThrow('Request failed: 500')

    vi.unstubAllGlobals()
  })
})
