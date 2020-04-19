/**
 * @note
 * Expects measurements in cm
 */
let meanSacDiameter = (length, width, height) => {
  return (length * width * height) / 3 + 30 // days
}

let daysToWeeks = (d) => d / 7

let mmToCm = (mm: number) => mm / 10
let cmToMm = (cm: number) => cm * 10

let makeUnit = (val: number, unit: "mm" | "cm") => {
  val = Math.max(0, val)
  switch (unit) {
    case "mm":
      return val

    case "cm":
      return mmToCm(val)
  }
}

export { meanSacDiameter, daysToWeeks, mmToCm, cmToMm, makeUnit }
