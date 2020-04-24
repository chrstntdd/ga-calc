/**
 * @note
 * Expects measurements in mm &
 * returns the amount of days
 */
let meanSacDiameter = (
  length: number,
  width: number,
  height: number
): number => {
  return (length + width + height) / 3 + 30 // days
}

let daysToWeeks = (d) => Math.floor(d / 7)

let formatDaysToWeeksAndDays = (d: number): [number, number] => {
  let weeks = daysToWeeks(d)
  let remainingDays = Math.round(d % 7)

  return [weeks, remainingDays]
}

let mmToCm = (mm: number) => mm / 10
let cmToMm = (cm: number) => cm * 10

export {
  meanSacDiameter,
  daysToWeeks,
  mmToCm,
  cmToMm,
  formatDaysToWeeksAndDays
}
