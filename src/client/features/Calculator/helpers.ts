/**
 * @note
 * Expects measurements in cm
 */
let meanSacDiameter = (length, width, height) => {
  return (length * width * height) / 3 + 30 // days
}

let daysToWeeks = d => d / 7

let mmToCm = (mm: number) => mm / 10
let cmToMm = (mm: number) => mm * 10

let makeUnit = (val: number, unit: "mm" | "cm") => {
  val = Math.max(0, val)
  switch (unit) {
    case "mm":
      return val

    case "cm":
      return mmToCm(val)
  }
}

function makeStorageFallback(): StorageLite {
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

export {
  meanSacDiameter,
  daysToWeeks,
  mmToCm,
  cmToMm,
  makeUnit,
  makeStorageFallback
}
