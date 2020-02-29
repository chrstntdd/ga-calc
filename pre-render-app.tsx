import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { tmpdir } from "os"
import { minify as terserMinify } from "terser"

import { h } from "preact"
import { render } from "preact-render-to-string"
import { minify } from "html-minifier"
import { collect } from "linaria/server"
import PurgeCSS from "purgecss"

import { walkSync } from "@chrstntdd/node"

import { App } from "./build/client/App"

const HTML_MINIFIER_OPTS = {
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  keepClosingSlash: true,
  minifyCSS: true,
  minifyJS: text => {
    const res = terserMinify(text, { warnings: true })
    if (res.warnings) console.log(res.warnings)
    if (res.error) {
      console.log(text)
      throw res.error
    }
    return res.code
  },
  minifyURLs: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
}

const tempHtmlPath = join(tmpdir(), "ga-calc-tmp.html")
const tempCSSPath = join(tmpdir(), "ga-calc-tmp.css")

async function preRenderApp(htmlTemplate: string): Promise<string> {
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
  const fullCSS = critical + other

  let fullHtml = htmlTemplate.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`
  )

  writeFileSync(tempHtmlPath, fullHtml)
  writeFileSync(tempCSSPath, fullCSS)

  const purgedCSS = (
    await new PurgeCSS().purge({
      content: [tempHtmlPath],
      css: [tempCSSPath]
    })
  )[0].css

  // console.log("raw", Buffer.from(fullCSS).length)
  // console.log("purged", Buffer.from(purgedCSS).length)

  const styleTag = `<style>${purgedCSS}</style>`

  let preRenderedTemplate = htmlTemplate.replace(
    "</title>",
    `</title>${styleTag}`
  )

  return minify(preRenderedTemplate, HTML_MINIFIER_OPTS)
}

export { preRenderApp }
