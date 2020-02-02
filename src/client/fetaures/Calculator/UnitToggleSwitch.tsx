import React from "react"
import { styled } from "goober"

import { ActiveUnderline } from "../../ActiveUnderline"
import { Box } from "../../components/styled/Box/Box"

let ToggleSwitchContainer = styled("div")`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.4rem;

  label {
    white-space: nowrap;
    text-align: center;

    & > input[type="radio"] {
      opacity: 0;
      height: 0;
      width: 0;
    }
  }
`

type Props = {
  dispatch: any
  activeIndex: number
}

let UnitToggleSwitch = React.memo<Props>(function UnitToggleSwitch({
  dispatch,
  activeIndex
}) {
  let mmInputRef = React.useRef(null)
  let cmInputRef = React.useRef(null)
  let containerRef = React.useRef(null)

  let setMM = () => {
    dispatch({ type: "SET_UNIT", payload: "mm" })
  }
  let setCM = () => {
    dispatch({ type: "SET_UNIT", payload: "cm" })
  }

  return (
    <div ref={containerRef}>
      <ToggleSwitchContainer>
        <label htmlFor="mm-opt" ref={mmInputRef} onClick={setMM}>
          <input
            name="unit-toggle"
            id="mm-opt"
            type="radio"
            onChange={setMM}
            defaultChecked
          />
          Millimeters (mm)
        </label>

        <Box width="lg" />

        <label htmlFor="cm-opt" ref={cmInputRef} onClick={setCM}>
          <input name="unit-toggle" id="cm-opt" type="radio" onChange={setCM} />
          Centimeters (cm)
        </label>
      </ToggleSwitchContainer>

      <ActiveUnderline
        container={containerRef}
        elements={[mmInputRef, cmInputRef]}
        activeIndex={activeIndex}
      />
    </div>
  )
})

export { UnitToggleSwitch }
