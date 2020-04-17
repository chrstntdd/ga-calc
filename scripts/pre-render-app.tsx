import { readFileSync, writeFileSync, readdirSync } from "fs"
import { join, resolve } from "path"
import { tmpdir } from "os"
import { minify as terserMinify } from "terser"

import { h } from "preact"
import { render } from "preact-render-to-string"
import { minify } from "html-minifier"
import { collect } from "linaria/server"
import PurgeCSS from "purgecss"

import { App } from "../build/client/App"

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
const CSS_DIR = join(__dirname, "../dist/css")

/**
 * @description
 * Collects critical CSS from linaria usage & purges unused selectors
 * using PurgeCSS by using the HTML emitted by rendering the app &
 * the main CSS file emitted by webpack and adds the CSS to an inline
 * style tag the head of the document. Also minifies everything
 */
async function makeHtmlTemplate(htmlTemplate: string): Promise<string> {
  let html = render(<App />)
  let css

  let [mainCSSFile] = readdirSync(CSS_DIR)
  css = readFileSync(join(CSS_DIR, mainCSSFile), "utf-8")

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
      css: [tempCSSPath],
      whitelist: ["data-focused"],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
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

export { makeHtmlTemplate }
