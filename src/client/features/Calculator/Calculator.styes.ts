import { css } from "linaria"

export let cn_mainCalculator = css`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1160px;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  @media (min-width: 1160px) {
    /* render the result on the right */
    align-items: flex-start;
    flex-direction: row-reverse;
  }

  & > fieldset {
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
`

export let cn_filedSet = css`
  display: flex;
  flex-direction: column;
`

export let cn_resetBtn = css`
  border: 1px solid var(--brand-1);
  padding: 0.8rem;
  color: white;
  background-color: transparent;
  border-radius: 0.2rem;
  font-weight: 400;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--brand-2);
    text-decoration: underline;
  }
`

export let cn_label = css`
  display: flex;
  align-items: center;
  position: relative;
  margin: 0.6rem 0;
`

export let cn_input_container = css`
  display: flex;
  border: 1px solid var(--brand-1);
  align-items: center;
  border-radius: 0.2rem;
  transition: border 200ms ease;
  width: 100%;
  justify-content: flex-end;

  &[data-focused="true"] {
    box-shadow: 0 0 0 2px var(--brand-1);
  }
`

export let cn_input = css`
  border: none;
  background-color: transparent;
  font-size: 1.6rem;
  color: var(--brand-1);
  text-align: right;
  width: 100%;
  min-height: 42px;

  &:focus {
    outline: none;
  }
`

export let cn_label_span = css`
  min-width: 60px;
  font-variant: small-caps;
  font-weight: 600;
`

export let cn_unit = css`
  width: 2rem;
`
