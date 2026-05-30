import { afterEach, vi } from 'vitest'

function createLocalStorageMock(): Storage {
  let store = new Map<string, string>()
  return {
    get length() {
      return store.size
    },
    clear() {
      store = new Map()
    },
    getItem(key: string) {
      return store.get(String(key)) ?? null
    },
    setItem(key: string, value: string) {
      store.set(String(key), String(value))
    },
    removeItem(key: string) {
      store.delete(String(key))
    },
    key(index: number) {
      return [...store.keys()][index] ?? null
    },
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: createLocalStorageMock(),
  configurable: true,
})

afterEach(() => {
  vi.clearAllMocks()
  globalThis.localStorage.clear()
})
