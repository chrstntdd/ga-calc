import React from "react"
import ReactDOM from "react-dom"
import { glob, setPragma } from "goober"

import { App } from "./App"

setPragma(React.createElement)

let inlineNormalize: string = preval`
let fs = require('fs')
let path = require('path')
module.exports = fs.readFileSync(path.resolve(process.cwd(), 'node_modules', 'normalize.css', 'normalize.css'), 'utf-8')
`

glob`
  ${inlineNormalize}
  :root {
    --brand-1: #373b27;
    --brand-2: #d18fb4;
  }

  * {
    -moz-osx-font-smoothing:grayscale;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
  }

  html, body {
    text-rendering: optimizeLegibility;
    font: 16px/1.8 -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
      Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
      sans-serif;
  }

  body {
    background-color: var(--brand-2);
    color: var(--brand-1);
    font-size: 16px;
    font-family:
  }
`

let root = document.getElementById("root")

ReactDOM.createRoot(root).render(<App />)
