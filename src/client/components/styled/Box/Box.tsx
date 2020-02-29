import { h } from "preact"
import { memo } from "preact/compat"

type SizeScale = "xxs" | "xs" | "sm" | "md" | "lg" | "xl"

type Props = Partial<{
  width: SizeScale
  height: SizeScale
}>

let sizeToRem = (n: SizeScale): string => {
  let remVal =
    n === "xxs"
      ? 0.6
      : n === "xs"
      ? 0.8
      : n === "sm"
      ? 1
      : n === "md"
      ? 1.2
      : n === "lg"
      ? 1.4
      : n === "xl"
      ? 1.8
      : 0

  return `${remVal}rem`
}

let Box = memo<Props>(function Box({ height, width }) {
  return (
    <div
      style={{
        height: sizeToRem(height),
        width: sizeToRem(width)
      }}
    />
  )
})

export { Box }
