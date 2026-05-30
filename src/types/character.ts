/** Shapes from https://rickandmortyapi.com/documentation (REST) */

export interface CharacterLocationRef {
  name: string
  url: string
}

/** Minimal fields needed for grid cards + localStorage favourites */
export type FavoriteCharacterSnapshot = Pick<
  Character,
  'id' | 'name' | 'species' | 'status' | 'image'
>

export interface Character {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: CharacterLocationRef
  location: CharacterLocationRef
  image: string
  episode: string[]
  url: string
  created: string
}

export interface CharactersInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface CharactersResponse {
  info: CharactersInfo
  results: Character[]
}

export interface ApiErrorBody {
  error: string
}
