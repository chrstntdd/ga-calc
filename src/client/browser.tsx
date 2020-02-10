import { h, render, hydrate } from "preact"
import { setPragma } from "goober"

import { App } from "./App"

setPragma(h)

let root = document.getElementById("root")

if (root.firstChild) {
  hydrate(<App />, root)
} else {
  render(<App />, root)
}
