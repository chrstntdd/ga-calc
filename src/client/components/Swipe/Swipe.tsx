import React from "react"

import { assignRef } from "../../utils"

let noop = () => {}

let getPoint = (event: TouchEvent | MouseEvent) => {
  if ("touches" in event) {
    let { pageX, pageY } = event.touches[0]
    return { x: pageX, y: pageY }
  }

  let { screenX, screenY } = event
  return { x: screenX, y: screenY }
}

const touchmoveConfig = {
  capture: true
} as const

type Props = Partial<{
  allowPointerEvents: boolean
  as: string
  children: any
  className: string
  tolerance: number

  onSwipeDown: any
  onSwipeEnd: any
  /** Starting from the left, swiping towards the right - "back" */
  onSwipeLeft: any
  onSwipeMove: (delta: { x: number; y: number }, event: any) => void
  /** Starting from the right, swiping towards the left - "forward" */
  onSwipeRight: any
  onSwipeStart: any
  onSwipeUp: any
}>

type CompositeHandlers = {
  onTouchStart: any
  onTouchCancel: any
  onTouchEnd: any
  onMouseDown?: any
  ref: (node: any) => void
}

let Swipe = React.forwardRef<HTMLDivElement, Props>(function Swipe(
  {
    allowPointerEvents = false,
    as: Comp = "div",
    children,
    className = "",
    tolerance = 0,

    // Direction handlers
    onSwipeUp = noop,
    onSwipeRight = noop,
    onSwipeDown = noop,
    onSwipeLeft = noop,

    // Swipe/Touch events
    onSwipeMove = noop,
    onSwipeStart = noop,
    onSwipeEnd = noop,
    ...props
  },
  theirRef
) {
  const rootNode = React.useRef<HTMLDivElement | null>(null),
    mouseDownRef = React.useRef(false),
    moveStartRef = React.useRef(null as any),
    movePositionRef = React.useRef(null as any),
    isMovingRef = React.useRef(false)

  let handleSwipeStart = (event: TouchEvent) => {
    let { x, y } = getPoint(event)
    moveStartRef.current = { x, y }
    onSwipeStart(event)
  }

  let handleSwipeMove = React.useCallback(
    (event: TouchEvent | MouseEvent) => {
      if (!moveStartRef.current) return

      let { x, y } = getPoint(event),
        deltaX = x - moveStartRef.current.x,
        deltaY = moveStartRef.current.y - y

      isMovingRef.current = true

      onSwipeMove({ x: deltaX, y: deltaY }, event)

      movePositionRef.current = { deltaX, deltaY }
    },
    [onSwipeMove]
  )

  let handleSwipeEnd = (event: TouchEvent) => {
    onSwipeEnd(event)

    if (isMovingRef.current && movePositionRef.current) {
      if (movePositionRef.current.deltaX < -tolerance) {
        onSwipeRight(event)
      } else if (movePositionRef.current.deltaX > tolerance) {
        onSwipeLeft(event)
      }
      if (movePositionRef.current.deltaY < -tolerance) {
        onSwipeDown(event)
      } else if (movePositionRef.current.deltaY > tolerance) {
        onSwipeUp(event)
      }
    }

    moveStartRef.current = null
    isMovingRef.current = false
    movePositionRef.current = null
  }

  let handlers: CompositeHandlers = {
    onTouchStart: handleSwipeStart,
    onTouchEnd: handleSwipeEnd,
    onTouchCancel: handleSwipeEnd,
    ref: (node: HTMLDivElement) => {
      assignRef(rootNode, node)
      assignRef(theirRef, node)
    }
  }

  if (allowPointerEvents) {
    let onMouseMove = (event: TouchEvent) => {
      handleSwipeMove(event)
    }

    let onMouseUp = (event: TouchEvent) => {
      mouseDownRef.current = false

      document.removeEventListener("mouseup", onMouseUp as EventListener)
      document.removeEventListener("mousemove", onMouseMove as EventListener)

      handleSwipeEnd(event)
    }

    handlers.onMouseDown = (event: TouchEvent) => {
      mouseDownRef.current = true

      document.addEventListener("mouseup", onMouseUp as EventListener)
      document.addEventListener("mousemove", onMouseMove as EventListener)

      handleSwipeStart(event)
    }
  }

  React.useEffect(() => {
    const target = rootNode.current
    if (target) {
      target.addEventListener("touchmove", handleSwipeMove, touchmoveConfig)
    }

    return () => {
      if (target) {
        target.removeEventListener(
          "touchmove",
          handleSwipeMove,
          touchmoveConfig
        )
      }
    }
  })

  return React.createElement(
    Comp,
    React.useMemo(
      () => ({
        ...handlers,
        className,
        children,
        ...props
      }),
      [className, children, props, handlers, theirRef]
    )
  )
})

export { Swipe }
