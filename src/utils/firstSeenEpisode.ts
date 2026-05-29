import type { Character } from '../types/character'

/** Parse numeric episode id from API episode URL. */
export function parseEpisodeIdFromUrl(url: string): number | null {
  const match = /\/episode\/(\d+)\s*$/.exec(url.trim())
  if (!match) return null
  const id = Number(match[1])
  return Number.isFinite(id) ? id : null
}

/**
 * Earliest episode id in the catalog for this character (first TV appearance).
 * Uses minimum episode id from the character's episode URL list.
 */
export function getFirstSeenEpisodeId(character: Character): number | null {
  const ids = character.episode.map(parseEpisodeIdFromUrl).filter((id): id is number => id !== null)
  if (ids.length === 0) return null
  return Math.min(...ids)
}
