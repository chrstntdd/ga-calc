import React from "react"
import { styled } from "goober"

import { ActiveUnderline } from "../../ActiveUnderline"
import { Box } from "../../components/styled/Box/Box"
import { useSpring } from "../../hooks/use-spring"

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

  let setMM = React.useCallback(() => {
    dispatch({ type: "SET_UNIT", payload: "mm" })
  }, [])
  let setCM = React.useCallback(() => {
    dispatch({ type: "SET_UNIT", payload: "cm" })
  }, [])

  return (
    <div ref={containerRef}>
      <ToggleSwitchContainer>
        <LabelBtn
          ref={mmInputRef}
          set={setMM}
          label="Millimeters (mm)"
          id="mm-opt"
          offset={100}
        />

        <Box width="lg" />

        <LabelBtn
          ref={cmInputRef}
          set={setCM}
          label="Centimeters (cm)"
          id="cm-opt"
          offset={200}
        />
      </ToggleSwitchContainer>

      <ActiveUnderline
        container={containerRef}
        elements={[mmInputRef, cmInputRef]}
        activeIndex={activeIndex}
      />
    </div>
  )
})

let LabelBtn = React.forwardRef(({ offset, label, set, id }, ref) => {
  const [opacity, setOpacity] = React.useState(0)
  const sprungOp = useSpring(opacity)

  React.useEffect(() => {
    let handle = setTimeout(() => {
      setOpacity(1)
    }, offset)

    return () => {
      if (handle) {
        clearTimeout(handle)
      }
    }
  })

  return (
    <label
      htmlFor={id}
      ref={ref}
      style={{
        opacity: sprungOp
      }}
    >
      <input name="unit-toggle" id={id} type="radio" onChange={set} />
      {label}
    </label>
  )
})

export { UnitToggleSwitch }
