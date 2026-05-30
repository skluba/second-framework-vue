import { describe, expect, it } from 'vitest'
import type { Character } from '../types/character'
import { getFirstSeenEpisodeId, parseEpisodeIdFromUrl } from './firstSeenEpisode'

describe('parseEpisodeIdFromUrl', () => {
  it('extracts id from API episode URL', () => {
    expect(parseEpisodeIdFromUrl('https://rickandmortyapi.com/api/episode/28')).toBe(28)
  })

  it('trims input before parsing', () => {
    expect(parseEpisodeIdFromUrl('  https://rickandmortyapi.com/api/episode/5  ')).toBe(5)
  })

  it('returns null for invalid input', () => {
    expect(parseEpisodeIdFromUrl('https://example.com')).toBeNull()
  })
})

describe('getFirstSeenEpisodeId', () => {
  it('returns minimum episode id', () => {
    const character = {
      episode: [
        'https://rickandmortyapi.com/api/episode/10',
        'https://rickandmortyapi.com/api/episode/3',
      ],
    } as unknown as Character

    expect(getFirstSeenEpisodeId(character)).toBe(3)
  })

  it('returns null when there are no episodes', () => {
    const character = { episode: [] } as unknown as Character
    expect(getFirstSeenEpisodeId(character)).toBeNull()
  })
})
