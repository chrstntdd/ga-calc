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

let StyledNum = styled("div")`
  font-size: 5.2rem;
  font-variant-numeric: tabular-nums;
  display: inline-block;
  line-height: 1.4;
  @media (min-width: 720px) {
    line-height: auto;
  }
`

function DisplayOutput({ unit, length, width, height }: State) {
  let result = React.useMemo(() => {
    return unit === "mm"
      ? meanSacDiameter(length, width, height)
      : meanSacDiameter(cmToMm(length), cmToMm(width), cmToMm(height))
  }, [unit, length, width, height])

  result = useSpring(result)

  return (
    <ResultContainer>
      <TimeResult>
        <StyledNum>{`${result | 0}`}</StyledNum>
        <TimeLabel>Days</TimeLabel>
      </TimeResult>

      <TimeResult>
        <StyledNum>{daysToWeeks(result).toFixed(2)}</StyledNum>
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

export { DisplayOutput }
