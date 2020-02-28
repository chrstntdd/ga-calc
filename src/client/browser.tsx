import { h, render } from "preact"
import "normalize.css"

import { App } from "./App"
import "./global.css"

let root = document.getElementById("root")

render(<App />, root)
