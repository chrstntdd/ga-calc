import { h } from "preact"
import { useRef, useCallback } from "preact/hooks"
import { memo, forwardRef } from "preact/compat"
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

let UnitToggleSwitch = memo<Props>(function UnitToggleSwitch({
  dispatch,
  activeIndex
}) {
  let mmInputRef = useRef(null)
  let cmInputRef = useRef(null)
  let containerRef = useRef(null)

  let setMM = useCallback(() => {
    dispatch({ type: "SET_UNIT", payload: "mm" })
  }, [])
  let setCM = useCallback(() => {
    dispatch({ type: "SET_UNIT", payload: "cm" })
  }, [])

  return (
    <div ref={containerRef}>
      <ToggleSwitchContainer>
        <LabelBtn
          ref={mmInputRef}
          onChange={setMM}
          label="Millimeters (mm)"
          id="mm-opt"
        />

        <Box width="lg" />

        <LabelBtn
          ref={cmInputRef}
          onChange={setCM}
          label="Centimeters (cm)"
          id="cm-opt"
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

let LabelBtn = forwardRef<
  HTMLLabelElement,
  {
    label: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    id: string
  }
>(function LabelBtn({ label, onChange, id }, ref) {
  return (
    <label htmlFor={id} ref={ref}>
      <input name="unit-toggle" id={id} type="radio" onChange={onChange} />
      {label}
    </label>
  )
})

export { UnitToggleSwitch }
