import { h } from "preact"
import { useEffect, useState } from "preact/hooks"
import { memo, Fragment } from "preact/compat"
import { css } from "linaria"

import { Box } from "../../components/styled/Box/Box"
import { createPersistedReducer } from "../../hooks/use-persisted-reducer"
import { useSpring } from "../../hooks/use-spring"

import { makeUnit, cmToMm, makeStorageFallback } from "./helpers"
import { UnitToggleSwitch } from "./UnitToggleSwitch"
import { DisplayOutput } from "./DisplayOutput"
import { Heading } from "./Heading"
import { State, Actions } from "./types"

let cn_mainCalculator = css`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1160px;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  @media (min-width: 1160px) {
    /* render the result on the right */
    align-items: flex-start;
    flex-direction: row-reverse;
  }

  & > fieldset {
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
`

let cn_filedSet = css`
  display: flex;
  flex-direction: column;
`

let cn_resetBtn = css`
  border: 1px solid var(--brand-1);
  padding: 0.8rem;
  color: white;
  background-color: transparent;
  border-radius: 0.2rem;
  font-weight: 400;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--brand-2);
    text-decoration: underline;
  }
`

let ResetBtn = ({ onClick, children, show }) => {
  const [trans, setTrans] = useState(30)
  const [opacity, setOpacity] = useState(0)
  const sprungTrans = useSpring(trans)
  const [scale, setScale] = useState(0.7)
  const sprungScale = useSpring(scale)
  const sprungOp = useSpring(opacity)

  useEffect(() => {
    setTrans(0)
    setScale(1)
  }, [])

  useEffect(() => {
    setOpacity(show ? 1 : 0)
  }, [show])

  return (
    <button
      className={cn_resetBtn}
      onClick={onClick}
      style={{
        transform: `translateY(${sprungTrans}px) scale(${sprungScale})`,
        opacity: sprungOp
      }}
    >
      {children}
    </button>
  )
}

const DEFAULT_MEASUREMENT_VAL = 0
let initState: State = {
  unit: "mm",
  length: DEFAULT_MEASUREMENT_VAL,
  width: DEFAULT_MEASUREMENT_VAL,
  height: DEFAULT_MEASUREMENT_VAL
}

let deriveState = (input: string, unit: State["unit"]): number => {
  let intVal = parseFloat(input)
  let valWithDefault = Number.isNaN(intVal) ? DEFAULT_MEASUREMENT_VAL : intVal

  switch (unit) {
    case "mm":
      return valWithDefault

    case "cm":
      return cmToMm(valWithDefault)

    default:
      throw Error("Unknown unit: " + unit)
  }
}

let reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case "SET_LENGTH":
      return { ...state, length: deriveState(action.payload, state.unit) }
    case "SET_WIDTH":
      return { ...state, width: deriveState(action.payload, state.unit) }
    case "SET_HEIGHT":
      return { ...state, height: deriveState(action.payload, state.unit) }
    case "SET_UNIT":
      return { ...state, unit: action.payload }
    case "RESET":
      return {
        ...state,
        length: initState.length,
        width: initState.width,
        height: initState.height
      }
  }
}

const usePersistedReducer = createPersistedReducer(
  "calc-red",
  // If localStorage is available, we can use it (the default) - else we create our own storage
  typeof window !== "undefined" && navigator.cookieEnabled
    ? void 0
    : makeStorageFallback()
)

let Calculator = () => {
  let [{ length, width, height, unit }, dispatch] = usePersistedReducer(
    reducer,
    initState
  )

  length = makeUnit(length, unit)
  width = makeUnit(width, unit)
  height = makeUnit(height, unit)

  return (
    <Fragment>
      <Heading />

      <Box height="xl" />

      <div className={cn_mainCalculator}>
        {/* Results must be above the inputs so results are readable on mobile */}
        <DisplayOutput
          height={height}
          width={width}
          length={length}
          unit={unit}
        />

        <FormInputs
          height={height}
          width={width}
          length={length}
          unit={unit}
          dispatch={dispatch}
        />
      </div>
    </Fragment>
  )
}

let inputsContainNonDefaultValues = (...mes) =>
  mes.some(m => m != DEFAULT_MEASUREMENT_VAL)

let FormInputs = ({
  dispatch,
  unit,
  length,
  width,
  height
}: { dispatch: any } & State) => {
  return (
    <fieldset>
      <div className={cn_filedSet}>
        <UnitToggleSwitch
          dispatch={dispatch}
          activeIndex={unit === "mm" ? 0 : 1}
        />

        <Box height="lg" />

        <NumericInput
          actionType="SET_LENGTH"
          dispatch={dispatch}
          id="Length"
          label="Length"
          unit={unit}
          value={length}
        />

        <NumericInput
          actionType="SET_WIDTH"
          dispatch={dispatch}
          id="Width"
          label="Width"
          unit={unit}
          value={width}
        />

        <NumericInput
          actionType="SET_HEIGHT"
          dispatch={dispatch}
          id="Height"
          label="Height"
          unit={unit}
          value={height}
        />

        <Box height="xs" />

        <ResetBtn
          show={inputsContainNonDefaultValues(length, width, height)}
          onClick={() => {
            dispatch({ type: "RESET" })
          }}
        >
          Clear measurements
        </ResetBtn>
      </div>
    </fieldset>
  )
}

let cn_label = css`
  display: flex;
  align-items: center;
  position: relative;
  margin: 0.6rem 0;
`

let cn_input_container = css`
  display: flex;
  border: 1px solid var(--brand-1);
  align-items: center;
  border-radius: 0.2rem;
  transition: border 200ms ease;
  width: 100%;
  justify-content: flex-end;

  &[data-focused="true"] {
    box-shadow: 0 0 0 2px var(--brand-1);
  }
`

let cn_input = css`
  border: none;
  background-color: transparent;
  font-size: 1.6rem;
  color: var(--brand-1);
  text-align: right;
  width: 100%;
  min-height: 42px;

  &:focus {
    outline: none;
  }
`

let cn_label_span = css`
  min-width: 60px;
  font-variant: small-caps;
  font-weight: 600;
`

let NumericInput = memo<{
  id: string
  dispatch: any
  value: any
  unit: State["unit"]
  label: string
  actionType: string
}>(function NumericInput({ dispatch, value, id, unit, label, actionType }) {
  const [focus, setFocus] = useState(false)

  return (
    <label htmlFor={id} className={cn_label}>
      <span className={cn_label_span}>{label}</span>
      <div className={cn_input_container} data-focused={focus}>
        <input
          className={cn_input}
          onFocus={() => {
            setFocus(true)
          }}
          onBlur={() => {
            setFocus(false)
          }}
          onChange={e => {
            dispatch({ type: actionType, payload: e.currentTarget!.value })
          }}
          value={value}
          id={id}
          type="text"
          inputMode="decimal"
          formNoValidate
          autoComplete="off"
        />
        <Box width="xxs" />
        <span>{unit}</span>
        <Box width="xxs" />
      </div>
    </label>
  )
})

export { Calculator }
