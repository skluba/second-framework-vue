import type { ApiErrorBody, CharactersResponse } from '../types/character'

const BASE_URL = 'https://rickandmortyapi.com/api'

export interface FetchCharactersParams {
  page: number
  name?: string
  species?: string
}

/** Empty list when API returns `{ error: string }` (e.g. no matches). */
export async function fetchCharacters(params: FetchCharactersParams): Promise<CharactersResponse> {
  const search = new URLSearchParams()
  search.set('page', String(params.page))
  if (params.name?.trim()) search.set('name', params.name.trim())
  if (params.species?.trim()) search.set('species', params.species.trim())

  const res = await fetch(`${BASE_URL}/character/?${search.toString()}`)
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }

  const data: CharactersResponse | ApiErrorBody = await res.json()
  if ('error' in data && typeof data.error === 'string') {
    return {
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    }
  }

  return data as CharactersResponse
}
