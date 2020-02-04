type State = Readonly<{
  unit: "mm" | "cm"
  length: number
  width: number
  height: number
}>

type Actions =
  | { type: "SET_LENGTH"; payload: string }
  | { type: "SET_WIDTH"; payload: string }
  | { type: "SET_HEIGHT"; payload: string }
  | { type: "SET_UNIT"; payload: State["unit"] }
  | { type: "RESET" }

export { State, Actions }
