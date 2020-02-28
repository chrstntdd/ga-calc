import { h } from "preact"
import { useRef, useCallback } from "preact/hooks"
import { memo, forwardRef, Fragment } from "preact/compat"
import { css } from "linaria"

import { ActiveUnderline } from "../../ActiveUnderline"
import { Box } from "../../components/styled/Box/Box"

let cn_toggleSwitchContainer = css`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.4rem;
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

  return (
    <Fragment>
      <div className={cn_toggleSwitchContainer} ref={containerRef}>
        <LabelBtn
          ref={mmInputRef}
          onChange={() => {
            dispatch({ type: "SET_UNIT", payload: "mm" })
          }}
          label="Millimeters (mm)"
          id="mm-opt"
        />

        <Box width="lg" />

        <LabelBtn
          ref={cmInputRef}
          onChange={() => {
            dispatch({ type: "SET_UNIT", payload: "cm" })
          }}
          label="Centimeters (cm)"
          id="cm-opt"
        />
      </div>

      <ActiveUnderline
        container={containerRef}
        elements={[mmInputRef, cmInputRef]}
        activeIndex={activeIndex}
      />
    </Fragment>
  )
})

let cn_label = css`
  white-space: nowrap;
  text-align: center;

  > * {
    opacity: 0;
    height: 0;
    width: 0;
  }
`

let LabelBtn = forwardRef<
  HTMLLabelElement,
  {
    label: string
    onChange: (event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => void
    id: string
  }
>(function LabelBtn({ label, onChange, id }, ref) {
  return (
    <label htmlFor={id} ref={ref} className={cn_label}>
      <input name="unit-toggle" id={id} type="radio" onChange={onChange} />
      {label}
    </label>
  )
})

export { UnitToggleSwitch }
