import { h } from "preact"
import { extractCss, setPragma } from "goober"
import { render } from "preact-render-to-string"
import { minify } from "html-minifier"

import { App } from "./build/client/App"

setPragma(h)

const HTML_MINIFIER_OPTS = {
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  keepClosingSlash: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
}

function preRenderApp(htmlTemplate: string): string {
  let html = render(<App />)
  const styleTag = `<style id="_goober">${extractCss()}</style>`

  let preRenderedTemplate = htmlTemplate
    // .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    .replace("</title>", `</title>${styleTag}`)

  return minify(preRenderedTemplate, HTML_MINIFIER_OPTS)
}

export { preRenderApp }
