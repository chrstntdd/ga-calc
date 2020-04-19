export function makeStorageFallback(): StorageLite {
  var store = {}
  return {
    getItem: function getItem(key) {
      return store[key] || null
    },
    setItem: function setItem(key, value) {
      store[key] = value.toString()
    },
    removeItem: function removeItem(key) {
      delete store[key]
    },
    clear: function clear() {
      store = {}
    }
  }
}
