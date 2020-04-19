import { h } from "preact"
import { useRef } from "preact/hooks"
import { css } from "linaria"

import { ActiveUnderline } from "../../ActiveUnderline"
import { Box } from "../../components/styled/Box/Box"

let cn_toggleSwitchContainer = css`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.4rem;
`

let UnitToggleSwitch = ({
  dispatch,
  activeIndex
}: {
  dispatch: any
  activeIndex: number
}) => {
  let mmInputRef = useRef(null)
  let cmInputRef = useRef(null)
  let containerRef = useRef(null)

  return [
    <div className={cn_toggleSwitchContainer} ref={containerRef}>
      <LabelBtn
        inRef={mmInputRef}
        onChange={() => {
          dispatch({ type: "SET_UNIT", payload: "mm" })
        }}
        label="Millimeters (mm)"
        id="mm-opt"
      />

      <Box width="lg" />

      <LabelBtn
        inRef={cmInputRef}
        onChange={() => {
          dispatch({ type: "SET_UNIT", payload: "cm" })
        }}
        label="Centimeters (cm)"
        id="cm-opt"
      />
    </div>,

    <ActiveUnderline
      container={containerRef}
      elements={[mmInputRef, cmInputRef]}
      activeIndex={activeIndex}
    />
  ]
}

let cn_label = css`
  white-space: nowrap;
  text-align: center;

  > * {
    opacity: 0;
    height: 0;
    width: 0;
  }
`

let LabelBtn: preact.FunctionComponent<{
  label: string
  onChange: (event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => void
  id: string
  inRef: preact.RefObject<HTMLLabelElement>
}> = ({ label, onChange, id, inRef }) => (
  <label htmlFor={id} ref={inRef} className={cn_label}>
    <input name="unit-toggle" id={id} type="radio" onChange={onChange} />
    {label}
  </label>
)

export { UnitToggleSwitch }
