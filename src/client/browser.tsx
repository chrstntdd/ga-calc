import { h, render, hydrate, options } from "preact"
import { setPragma } from "goober"
import "preact/debug"

import { App } from "./App"
import "./global.styles"

setPragma(h)
options.debounceRendering =
  "requestIdleCallback" in window ? requestIdleCallback : requestAnimationFrame

let root = document.getElementById("root")

if (root.firstChild) {
  hydrate(<App />, root)
} else {
  render(<App />, root)
}
