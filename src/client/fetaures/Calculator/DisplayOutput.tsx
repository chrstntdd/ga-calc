import React from "react"
import { styled } from "goober"

import { useSpring } from "../../hooks/use-spring"

import { State } from "./types"
import { meanSacDiameter, cmToMm, daysToWeeks } from "./helpers"

let ResultContainer = styled("div")`
  width: 100%;
  margin: 1rem 0;
  @media (min-width: 760px) {
    margin: 0;
  }
`

let TimeResult = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
  width: 100%;
`

let TimeLabelSpan = styled("span")`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
`

function DisplayOutput({ unit, length, width, height }: State) {
  let [animNumbers, setAnimNumbers] = React.useState(true)
  let result = React.useMemo(() => {
    return unit === "mm"
      ? meanSacDiameter(length, width, height)
      : meanSacDiameter(cmToMm(length), cmToMm(width), cmToMm(height))
  }, [unit, length, width, height])

  /**
   * We only want the trailing reveal on the first mount,
   * updates to the result should not have their position/opacity
   * animated.
   *
   * TODO: Find better way of determining when the transition has ended from here
   */
  React.useEffect(() => {
    setTimeout(() => {
      setAnimNumbers(false)
    }, 2000)
  }, [])

  result = useSpring(result)

  return (
    <ResultContainer>
      <TimeResult>
        <StyledNum animNumbers={animNumbers} offset={1}>
          {`${result | 0}`}
        </StyledNum>
        <TimeLabel offset={1}>Days</TimeLabel>
      </TimeResult>

      <TimeResult>
        <StyledNum animNumbers={animNumbers} offset={200}>
          {daysToWeeks(result).toFixed(2)}
        </StyledNum>
        <TimeLabel offset={200}>Weeks</TimeLabel>
      </TimeResult>
    </ResultContainer>
  )
}

let TimeLabel = React.memo(function TimeLabel({ offset, children }) {
  const [trans, setTrans] = React.useState(10)
  const [opacity, setOpacity] = React.useState(0)
  const sprungTrans = useSpring(trans)
  const sprungOp = useSpring(opacity)

  React.useEffect(() => {
    let handle = setTimeout(() => {
      setTrans(0)
      setOpacity(1)
    }, offset)

    return () => {
      if (handle) {
        clearTimeout(handle)
      }
    }
  }, [offset])

  return (
    <TimeLabelSpan
      style={{
        transform: `translateY(${sprungTrans}px)`,
        opacity: sprungOp
      }}
    >
      {children}
    </TimeLabelSpan>
  )
})

function StyledNum({
  children,
  offset,
  animNumbers
}: {
  children: string
  offset: number
  animNumbers: boolean
}) {
  let chars = children.split("")

  return (
    <div>
      {chars.map((ch, i) => {
        return (
          <StyledChar
            animNumbers={animNumbers}
            char={ch}
            offset={i + 1}
            key={i}
            timingOffset={offset}
          />
        )
      })}
    </div>
  )
}

let StyledCharSpan = styled("span")`
  font-size: 5.2rem;
  font-variant-numeric: tabular-nums;
  display: inline-block;
  line-height: 1.4;
  @media (min-width: 720px) {
    line-height: auto;
  }
`

function StyledChar({ char, offset, timingOffset, animNumbers }) {
  const [trans, setTrans] = React.useState(8 * (offset * 1.5))
  const [opacity, setOpacity] = React.useState(0)
  const sprungTrans = useSpring(trans)
  const sprungOp = useSpring(opacity)

  React.useEffect(() => {
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
    <StyledCharSpan
      style={{
        transform: `translateY(${animNumbers ? sprungTrans : 0}px)`,
        opacity: animNumbers ? sprungOp : 1
      }}
    >
      {char}
    </StyledCharSpan>
  )
}

export { DisplayOutput }
