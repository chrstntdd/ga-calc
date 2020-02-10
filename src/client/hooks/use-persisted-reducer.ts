import { useReducer, useEffect } from "preact/hooks"

const usePersistedReducer = (
  reducer,
  initialState,
  init,
  key,
  storage
): [any, Function] => {
  const [state, dispatch] = useReducer(
    reducer,
    storage.get(key, initialState),
    init
  )

  useEffect(() => {
    storage.set(key, state)
  }, [state, key])

  return [state, dispatch]
}

const createStorage = provider => ({
  get(key, initialState) {
    const json = provider.getItem(key)
    return json === null
      ? typeof initialState === "function"
        ? initialState()
        : initialState
      : JSON.parse(json)
  },
  set(key, value) {
    provider.setItem(key, JSON.stringify(value))
  }
})

const createPersistedReducer = (
  key: string,
  provider: StorageLite = globalThis.localStorage
) => {
  if (provider) {
    const storage = createStorage(provider)
    return (reducer, initialState, init?) =>
      usePersistedReducer(reducer, initialState, init, key, storage)
  }
  return useReducer
}

export { createPersistedReducer }
