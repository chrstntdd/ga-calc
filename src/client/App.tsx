import { h } from "preact"

import { Calculator } from "./fetaures/Calculator/Calculator"

// TODO: do side effect here once we can compile preval
// import "./global.styles"

const App = () => {
  return (
    <main>
      <Calculator />
    </main>
  )
}

export { App }
