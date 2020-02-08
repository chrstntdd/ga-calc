import React from "react"
import { styled } from "goober"

import { Box } from "../../components/styled/Box/Box"
import { createPersistedReducer } from "../../hooks/use-persisted-reducer"
import { useSpring } from "../../hooks/use-spring"

import { makeUnit, cmToMm, makeStorageFallback } from "./helpers"
import { UnitToggleSwitch } from "./UnitToggleSwitch"
import { DisplayOutput } from "./DisplayOutput"
import { State, Actions } from "./types"

let Heading = React.memo(function Heading() {
  return (
    <>
      <Title>📏 GA 🧮</Title>
      <Subtitle>
        Calculate{" "}
        <a href="https://en.wikipedia.org/wiki/Gestational_age">
          gestational age
        </a>{" "}
        based on MSD
      </Subtitle>
    </>
  )
})

let MainCalculator = styled("div")`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 720px;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  @media (min-width: 760px) {
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

let FieldsetFlex = styled("div")`
  display: flex;
  flex-direction: column;
`

let Title = styled("h1")`
  font-size: 2.8rem;
  margin: 0 auto;
  text-align: center;
`
let Subtitle = styled("h2")`
  font-size: 1rem;
  margin: 0 auto;
  text-align: center;
  font-style: italic;
  & > a {
    font-style: none;
    color: inherit;
  }

  /* Hide the spacing boxes on mobile */
  & ~ [height] {
    @media (max-width: 760px) {
      display: none;
    }
  }
`
let _ResetBtn = styled("button")`
  margin-right: 0 auto;
  border: 1px solid var(--brand-1);
  padding: 0.8rem;
  color: var(--brand-2);
  background-color: var(--brand-1);
  border-radius: 0.2rem;
  font-weight: 400;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--brand-2);
    text-decoration: underline;
  }
`

let ResetBtn = ({ onClick, children }) => {
  const [trans, setTrans] = React.useState(10 * (4 * 1.5))
  const [opacity, setOpacity] = React.useState(0)
  const sprungTrans = useSpring(trans)
  const sprungOp = useSpring(opacity)

  React.useEffect(() => {
    setTrans(0)
    setOpacity(1)
  }, [])

  return (
    <_ResetBtn
      onClick={onClick}
      style={{ transform: `translateY(${sprungTrans}px)`, opacity: sprungOp }}
    >
      {children}
    </_ResetBtn>
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
  navigator.cookieEnabled ? void 0 : makeStorageFallback()
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
    <>
      <Heading />

      <Box height="xl" />

      <MainCalculator>
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
      </MainCalculator>
    </>
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
      <FieldsetFlex>
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
          offset={1}
        />

        <NumericInput
          actionType="SET_WIDTH"
          dispatch={dispatch}
          id="Width"
          label="Width"
          unit={unit}
          value={width}
          offset={2}
        />

        <NumericInput
          actionType="SET_HEIGHT"
          dispatch={dispatch}
          id="Height"
          label="Height"
          unit={unit}
          value={height}
          offset={3}
        />

        <Box height="xs" />

        {inputsContainNonDefaultValues(length, width, height) && (
          <ResetBtn
            onClick={() => {
              dispatch({ type: "RESET" })
            }}
          >
            Clear measurements
          </ResetBtn>
        )}
      </FieldsetFlex>
    </fieldset>
  )
}

let Input = styled("label")`
  display: flex;
  align-items: center;
  position: relative;
  margin: 0.6rem 0;

  .label {
    min-width: 60px;
  }

  .input-container {
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

    & > input {
      border: none;
      background-color: transparent;
      font-size: 1.6rem;
      color: var(--brand-1);
      text-align: right;
      max-width: 10rem;

      min-height: 42px;

      &:focus {
        outline: none;
      }
    }

    & > .unit {
      color: white;
    }
  }
` as StyledNode

let NumericInput = React.memo<{
  id: string
  dispatch: any
  value: any
  unit: State["unit"]
  label: string
  actionType: string
  offset: number
}>(function NumericInput({
  dispatch,
  value,
  id,
  unit,
  label,
  actionType,
  offset
}) {
  const [focus, setFocus] = React.useState(false)
  const [trans, setTrans] = React.useState(10 * (offset * 1.5))
  const [opacity, setOpacity] = React.useState(0)
  const sprungTrans = useSpring(trans)
  const sprungOp = useSpring(opacity)

  React.useEffect(() => {
    setTrans(0)
    setOpacity(1)
  }, [])

  return (
    <Input
      htmlFor={id}
      style={{ transform: `translateY(${sprungTrans}px)`, opacity: sprungOp }}
    >
      <span className="label">{label}</span>
      <div className="input-container" data-focused={focus}>
        <input
          onFocus={e => {
            e.target.select()
            setFocus(true)
          }}
          onBlur={() => {
            setFocus(false)
          }}
          onChange={e => {
            dispatch({ type: actionType, payload: e.target.value })
          }}
          value={value}
          id={id}
          type="tel"
          pattern="[0-9]+"
          formNoValidate
          autoComplete="off"
        />
        <Box width="xxs" />
        <span>{unit}</span>
        <Box width="xxs" />
      </div>
    </Input>
  )
})

export { Calculator }
