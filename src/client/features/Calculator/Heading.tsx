import { h } from "preact"
import { memo, Fragment } from "preact/compat"
import { css } from "linaria"

let cn_title = css`
  font-size: 2.8rem;
  margin: 0 auto;
  text-align: center;
`
let cn_subtitle = css`
  font-size: 1rem;
  margin: 0 auto;
  text-align: center;
  font-style: italic;
  > a {
    font-style: none;
    color: inherit;
  }
`

let Heading = memo(function Heading() {
  return (
    <Fragment>
      <h1 className={cn_title}>📏 GA 🧮</h1>
      <h2 className={cn_subtitle}>
        Calculate{" "}
        <a href="https://en.wikipedia.org/wiki/Gestational_age">
          gestational age
        </a>{" "}
        based on MSD
      </h2>
    </Fragment>
  )
})

export { Heading }
