import { h } from "preact"
import { useMemo, useState, useEffect } from "preact/hooks"
import { css } from "linaria"

import { useSpring } from "../../hooks/use-spring"

import { State } from "./types"
import { meanSacDiameter, formatDaysToWeeksAndDays } from "./helpers"

let cn_timeResult = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
  width: 100%;
`

let cn_resultContainer = css`
  width: 100%;
  margin: 1rem 0;
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);

  &[data-status="only-weeks"] {
    .${cn_timeResult} {
      grid-row: span 2;
    }
  }

  @media (min-width: 1160px) {
    margin: 0;
  }
`

let cn_timeLabelSpan = css`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
`

let cn_dayOutput = css`
  grid-column: 2;
  grid-row: 2;
  justify-self: start;
  display: flex;
  align-self: flex-start;

  &[data-status="only-weeks"] {
    grid-column: span 2;
    justify-self: center;
  }
`

let DisplayOutput = ({ length, width, height }: State) => {
  let [animNumbers, setAnimNumbers] = useState(true)
  let [weeks, remainingDays] = useMemo<[number, number]>(() => {
    let totalDays = meanSacDiameter(length, width, height)

    return formatDaysToWeeksAndDays(totalDays)
  }, [length, width, height])

  /**
   * We only want the trailing reveal on the first mount,
   * updates to the result should not have their position/opacity
   * animated.
   *
   * TODO: Find better way of determining when the transition has ended from here
   */
  useEffect(() => {
    setTimeout(() => {
      setAnimNumbers(false)
    }, 2000)
  }, [])

  weeks = useSpring(weeks)
  remainingDays = useSpring(remainingDays)

  let dayCount = Math.floor(remainingDays)

  return (
    <div
      data-status={dayCount ? "with-days" : "only-weeks"}
      className={cn_resultContainer}
    >
      <div className={cn_timeResult}>
        <StyledNum animNumbers={animNumbers} offset={1}>
          {`${Math.floor(weeks)}`}
        </StyledNum>
        <TimeLabel>Weeks</TimeLabel>
      </div>
      {dayCount ? (
        <div
          className={`${css`
            align-self: end;
            grid-column: 2;
            grid-row: 1;
          `}`}
        >
          and
        </div>
      ) : null}
      {dayCount ? (
        <div className={`relative ${cn_dayOutput}`}>
          <StyledNum animNumbers={animNumbers} offset={1}>
            {`${dayCount}`}
          </StyledNum>
          <TimeLabel
            className={`${css`
              bottom: 0;
              top: unset;
            `}`}
          >
            {`Day${dayCount > 1 ? "s" : ""}`}
          </TimeLabel>
        </div>
      ) : null}
    </div>
  )
}

let TimeLabel = ({
  children,
  className
}: {
  className?: string
  children: any
}) => (
  <span className={`${cn_timeLabelSpan} ${className || ""}`}>{children}</span>
)

let StyledNum = ({
  children,
  animNumbers
}: {
  children: string
  offset: number
  animNumbers: boolean
}) => {
  let parsedChildren = parseFloat(children)
  let charType =
    typeof parsedChildren === "number" && !Number.isNaN(parsedChildren)
      ? "number"
      : "string"

  let splitChildren = children.split(charType === "number" ? "" : " ")
  let chars = splitChildren.flatMap((c, index) => {
    if (charType === "number") {
      return [c]
    }

    let wordChars = c.split("")
    // Add space between each word except for the last word
    if (index !== splitChildren.length - 1) {
      wordChars.push(" ")
    }
    return wordChars
  })

  return (
    <div>
      {map(chars, (ch, i) => (
        <StyledChar
          animNumbers={animNumbers}
          char={ch}
          key={`${ch}${i}`}
          timingOffset={i * 50}
        />
      ))}
    </div>
  )
}

let cn_styledCharSpan = css`
  font-size: 5.2rem;
  font-variant-numeric: tabular-nums;
  display: inline-block;
  line-height: 1.4;
  &[data-space] {
    width: 1rem;
  }
`

const scfg = { stiffness: 200, damping: 10, mass: 0.5, decimals: 2 }

let StyledChar = ({ char, timingOffset, animNumbers }) => {
  const [trans, setTrans] = useState(50)
  const [opacity, setOpacity] = useState(0)
  const sprungTrans = useSpring(trans, scfg)
  const sprungOp = useSpring(opacity)

  useEffect(() => {
    let handle = setTimeout(() => {
      if (animNumbers) {
        setTrans(0)
        setOpacity(1)
      }
    }, timingOffset)

    return () => {
      if (handle) {
        clearTimeout(handle)
      }
    }
  }, [animNumbers])

  return (
    <span
      className={cn_styledCharSpan}
      data-space={char === " " ? "" : null}
      style={{
        transform: `translateY(${animNumbers ? sprungTrans : 0}px)`,
        opacity: animNumbers ? sprungOp : 1
      }}
    >
      {char}
    </span>
  )
}

function map<A, B>(arr: A[], fn: (a: A, i: number, arr: A[]) => B): B[] {
  if (!arr) return []

  let i = 0,
    len = arr.length,
    out = new Array(len)

  for (; i < len; i++) {
    out[i] = fn(arr[i], i, arr)
  }

  return out
}

export { DisplayOutput }
