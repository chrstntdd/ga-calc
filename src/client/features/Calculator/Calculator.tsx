import { h } from "preact"
import { useEffect, useState } from "preact/hooks"

import { Box } from "../../components/styled/Box/Box"
import { createPersistedReducer } from "../../hooks/use-persisted-reducer"
import { useSpring } from "../../hooks/use-spring"

import { makeStorageFallback } from "./make-storage-fallback"
import { DisplayOutput } from "./DisplayOutput"
import { Heading } from "./Heading"
import { State, Actions } from "./types"
import {
  cn_input,
  cn_resetBtn,
  cn_mainCalculator,
  cn_filedSet,
  cn_label,
  cn_label_span,
  cn_input_container,
  cn_unit
} from "./Calculator.styes"

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
  length: DEFAULT_MEASUREMENT_VAL,
  width: DEFAULT_MEASUREMENT_VAL,
  height: DEFAULT_MEASUREMENT_VAL
}

let deriveState = (input: string): number => {
  let intVal = parseFloat(input)
  let valWithDefault = Number.isNaN(intVal) ? DEFAULT_MEASUREMENT_VAL : intVal

  return valWithDefault
}

let reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case "SET_LENGTH":
      return { ...state, length: deriveState(action.payload) }
    case "SET_WIDTH":
      return { ...state, width: deriveState(action.payload) }
    case "SET_HEIGHT":
      return { ...state, height: deriveState(action.payload) }

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
  let [{ length, width, height }, dispatch] = usePersistedReducer(
    reducer,
    initState
  )

  return [
    <Heading />,

    <Box height="xl" />,

    <div className={cn_mainCalculator}>
      {/* Results must be above the inputs so results are readable on mobile */}
      <DisplayOutput height={height} width={width} length={length} />

      <fieldset>
        <div className={cn_filedSet}>
          <Box height="lg" />

          <NumericInput
            actionType="SET_LENGTH"
            dispatch={dispatch}
            id="Length"
            label="Length"
            value={length}
          />

          <NumericInput
            actionType="SET_WIDTH"
            dispatch={dispatch}
            id="Width"
            label="Width"
            value={width}
          />

          <NumericInput
            actionType="SET_HEIGHT"
            dispatch={dispatch}
            id="Height"
            label="Height"
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
    </div>
  ]
}

let inputsContainNonDefaultValues = (...mes) =>
  mes.some((m) => m != DEFAULT_MEASUREMENT_VAL)

let NumericInput: preact.FunctionComponent<{
  id: string
  dispatch: any
  value: any
  label: string
  actionType: string
}> = ({ dispatch, value, id, label, actionType }) => {
  const [focus, setFocus] = useState(false)

  return (
    <label htmlFor={id} className={cn_label}>
      <span className={cn_label_span}>{label}</span>
      <div className={cn_input_container} data-focused={focus}>
        <input
          className={cn_input}
          onFocus={(e) => {
            e.currentTarget.select()
            setFocus(true)
          }}
          onBlur={() => {
            setFocus(false)
          }}
          // Sync the value when we lose focus
          value={deriveInputValue(value, focus)}
          onInput={(e) => {
            dispatch({
              type: actionType,
              payload: e.currentTarget!.value
            })
          }}
          id={id}
          inputMode="decimal"
          formNoValidate={true}
        />
        <Box width="xxs" />
        <span className={cn_unit}>mm</span>
        <Box width="xxs" />
      </div>
    </label>
  )
}

function deriveInputValue(value, focused) {
  // Let input be uncontrolled
  if (focused) return

  /**
   * @desc
   * Trying to get around float weirdness for the case
   * when we have a float measurement in mm which can get
   * converted to mm.
   *
   * 2.3 mm -> 0.23 cm is what we expect
   *
   * With plain JS this is not the case
   *
   * 2.3 mm -> 0.22999999999999998 cm 😞
   *
   * This hack should properly round things and trim any non-significant
   * zeros.
   *
   */
  if ((value + "").includes(".")) {
    return parseFloat(parseFloat(value).toPrecision(10)).toString()
  }
  return value
}

export { Calculator }
