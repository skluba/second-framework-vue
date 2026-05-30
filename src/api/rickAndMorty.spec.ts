import { describe, expect, it, vi } from 'vitest'
import { fetchCharacterById, fetchCharacters, fetchEpisodeById } from './rickAndMorty'

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

describe('fetchCharacterById', () => {
  it('returns character on success', async () => {
    const rick = { id: 1, name: 'Rick Sanchez' }

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => rick,
      })) as unknown as typeof fetch,
    )

    await expect(fetchCharacterById(1)).resolves.toEqual(rick)
    expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1')

    vi.unstubAllGlobals()
  })

  it('throws when character is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 404,
        json: async () => ({}),
      })) as unknown as typeof fetch,
    )

    await expect(fetchCharacterById(99999)).rejects.toThrow('Character not found')

    vi.unstubAllGlobals()
  })

  it('throws when response body contains error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ error: 'Ephemeral rift' }),
      })) as unknown as typeof fetch,
    )

    await expect(fetchCharacterById(1)).rejects.toThrow('Ephemeral rift')

    vi.unstubAllGlobals()
  })

  it('throws when HTTP status is not ok (non-404)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 503,
        json: async () => ({}),
      })) as unknown as typeof fetch,
    )

    await expect(fetchCharacterById(1)).rejects.toThrow('Request failed: 503')

    vi.unstubAllGlobals()
  })
})

describe('fetchEpisodeById', () => {
  it('returns episode on success', async () => {
    const pilot = { id: 1, name: 'Pilot' }

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => pilot,
      })) as unknown as typeof fetch,
    )

    await expect(fetchEpisodeById(1)).resolves.toEqual(pilot)

    vi.unstubAllGlobals()
  })

  it('throws when HTTP status is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 502,
        json: async () => ({}),
      })) as unknown as typeof fetch,
    )

    await expect(fetchEpisodeById(2)).rejects.toThrow('Request failed: 502')

    vi.unstubAllGlobals()
  })

  it('throws when response body contains error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ error: 'Missing episode' }),
      })) as unknown as typeof fetch,
    )

    await expect(fetchEpisodeById(99)).rejects.toThrow('Missing episode')

    vi.unstubAllGlobals()
  })
})
