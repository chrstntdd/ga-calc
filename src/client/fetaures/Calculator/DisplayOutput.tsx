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
    let handle = setTimeout(() => {
      setAnimNumbers(false)
    }, 2000)
    return () => {
      if (handle) {
        clearInterval(handle)
      }
    }
  }, [])

  result = useSpring(result)

  return (
    <ResultContainer>
      <TimeResult>
        <StyledNum animNumbers={animNumbers}>{`${result | 0}`}</StyledNum>
        <TimeLabel>Days</TimeLabel>
      </TimeResult>

      <TimeResult>
        <StyledNum animNumbers={animNumbers}>
          {daysToWeeks(result).toFixed(2)}
        </StyledNum>
        <TimeLabel>Weeks</TimeLabel>
      </TimeResult>
    </ResultContainer>
  )
}

let TimeLabelSpan = styled("span")`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
`

let TimeLabel = React.memo(function TimeLabel({ children }) {
  return <TimeLabelSpan>{children}</TimeLabelSpan>
})

function StyledNum({
  children,
  animNumbers
}: {
  children: string
  animNumbers: boolean
}) {
  let chars = React.useMemo(() => children.split(""), [children])

  return (
    <div>
      {chars.map((ch, i) => {
        return (
          <StyledChar
            animNumbers={animNumbers}
            char={ch}
            offset={i + 1}
            key={`${i}${ch}`}
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

function StyledChar({ char, offset, animNumbers }) {
  const [trans, setTrans] = React.useState(8 * (offset * 1.5))
  const [opacity, setOpacity] = React.useState(0)
  const sprungTrans = useSpring(trans)
  const sprungOp = useSpring(opacity)

  React.useEffect(() => {
    if (animNumbers) {
      setTrans(0)
      setOpacity(1)
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
