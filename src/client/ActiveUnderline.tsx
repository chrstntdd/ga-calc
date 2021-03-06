import { h } from "preact"
import { useEffect, useState } from "preact/hooks"
import { css } from "linaria"

import { useSpring } from "./hooks/use-spring"

let cn_activeUnderline = css`
  position: relative;
  height: 0.2rem;
  background-color: var(--brand-1);
  left: 0;
  margin-top: -0.2rem;
  border-radius: 0.6rem;
`

type Rectangle = ClientRect | DOMRect

const measureDomNodes = (
  elements: preact.RefObject<HTMLElement>[]
): Rectangle[] =>
  elements.flatMap(
    (el) => el && el.current && el.current.getBoundingClientRect()
  )

let ActiveUnderline = ({ container, elements, activeIndex }) => {
  let [rects, setRects] = useState([])
  let [parentNode, setParentNode] = useState()

  useEffect(() => {
    let isHere = true

    const updateRectangleMeasurements = () => {
      if (isHere) {
        setParentNode(container ? measureDomNodes([container])[0] : null)
        setRects(measureDomNodes(elements))
      }
    }

    addEventListener("resize", updateRectangleMeasurements)

    let rafRef = requestAnimationFrame(updateRectangleMeasurements)

    return () => {
      isHere = false

      if (rafRef) cancelAnimationFrame(rafRef)

      removeEventListener("resize", updateRectangleMeasurements)
    }
  }, [container, elements])

  let style = Object.create(null),
    left,
    width,
    transformX = 0

  if (rects && rects[activeIndex]) {
    let rect = rects[activeIndex]

    left = rect.left
    width = rect.width
    transformX = parentNode ? left - parentNode.left : left

    style = {
      width,
      transform: `translate3d(${transformX}px, 0, 0)`
    }
  }

  let sprungTransform = useSpring(transformX)

  style.transform = `translate3d(${sprungTransform}px, 0, 0)`
  style.width = `${width}px`

  return <div style={style} className={cn_activeUnderline} />
}

export { ActiveUnderline }
