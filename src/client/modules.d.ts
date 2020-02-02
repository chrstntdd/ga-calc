import * as ReactDOM from "react-dom"

declare module "react-dom" {
  function createRoot(
    node: HTMLElement,
    options?: { hydrate?: boolean }
  ): { render: (n: JSX.Element) => void }
  function createBlockingRoot(
    node: HTMLElement,
    options?: { hydrate?: boolean }
  ): { render: (n: JSX.Element) => void }
}
