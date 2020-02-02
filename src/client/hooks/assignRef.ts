const assignRef = <ValueType>(
  ref: null | ((value: ValueType) => void) | preact.RefObject<ValueType>,
  value: ValueType
) => {
  if (ref === null) return
  if (typeof ref === "function") {
    ref(value)
  } else {
    try {
      ref.current = value
    } catch (error) {
      throw new Error(`Cannot assign value "${value}" to ref "${ref}"`)
    }
  }
}

export { assignRef }
