import { h } from "preact"
import { useMemo, useState, useEffect } from "preact/hooks"
import { memo } from "preact/compat"
import { styled } from "goober"

import { useSpring } from "../../hooks/use-spring"

import { State } from "./types"
import { meanSacDiameter, cmToMm, daysToWeeks } from "./helpers"

let ResultContainer = styled("div")`
  width: 100%;
  margin: 1rem 0;
  @media (min-width: 1160px) {
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
  let [animNumbers, setAnimNumbers] = useState(true)
  let result = useMemo(() => {
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
  useEffect(() => {
    setTimeout(() => {
      setAnimNumbers(false)
    }, 2000)
  }, [])

  result = useSpring(result)

  return (
    <ResultContainer>
      <TimeResult>
        <StyledNum animNumbers={animNumbers} offset={1}>
          {`${Math.floor(result)}`}
        </StyledNum>
        <TimeLabel>Days</TimeLabel>
      </TimeResult>

      <TimeResult>
        <StyledNum animNumbers={animNumbers} offset={200}>
          {daysToWeeks(result).toFixed(2)}
        </StyledNum>
        <TimeLabel>Weeks</TimeLabel>
      </TimeResult>
    </ResultContainer>
  )
}

let TimeLabel = memo(function TimeLabel({ children }) {
  return <TimeLabelSpan>{children}</TimeLabelSpan>
})

function StyledNum({
  children,
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
            key={`${ch}${i}`}
            timingOffset={i * 50}
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
`

const scfg = { stiffness: 200, damping: 10, mass: 0.5, decimals: 2 }

function StyledChar({ char, timingOffset, animNumbers }) {
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
