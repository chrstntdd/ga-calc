import { CSSProperties } from "react"

declare global {
  interface Window {
    requestIdleCallback(cb: (deadline: any) => any): NodeJS.Timer
    cancelIdleCallback(id: NodeJS.Timer): void
  }

  const preval: any

  const __DEV__: boolean

  type $FuckIt = any

  // Keep TS happy with passing styles directly to the node
  type StyledNode<T = any> = React.FC<T> & {
    style?: CSSProperties
    htmlFor?: string
  }

  type StorageLite = Omit<Storage, "length" | "key">
}

export {}
