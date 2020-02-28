import { h } from "preact"
import { readFileSync } from "fs"
import { render } from "preact-render-to-string"
import { minify } from "html-minifier"
import { collect } from "linaria/server"

import { walkSync } from "@chrstntdd/node"

import { App } from "./build/client/App"
import { join } from "path"

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
  let css
  for (let { name } of walkSync(join(__dirname, "dist/css"), {
    includeFiles: true,
    includeDirs: false,
    filter: n => /\.css$/.test(n)
  })) {
    css = readFileSync(name, "utf-8")
  }
  const { critical, other } = collect(html, css)

  const styleTag = `<style>${critical + other}</style>`

  let preRenderedTemplate = htmlTemplate
    // .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    .replace("</title>", `</title>${styleTag}`)

  return minify(preRenderedTemplate, HTML_MINIFIER_OPTS)
}

export { preRenderApp }
