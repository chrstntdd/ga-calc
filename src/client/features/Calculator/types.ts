type State = Readonly<{
  length: number
  width: number
  height: number
}>

type Actions =
  | { type: "SET_LENGTH"; payload: string }
  | { type: "SET_WIDTH"; payload: string }
  | { type: "SET_HEIGHT"; payload: string }
  | { type: "RESET" }

export { State, Actions }
