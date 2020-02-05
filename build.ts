import { readFileSync, readdirSync, writeFileSync, unlinkSync } from "fs"
import { join, resolve } from "path"

let outDir = join(__dirname, "dist")
let jsDir = join(outDir, "js")
const htmlPath = join(outDir, "index.html")

let html = readFileSync(htmlPath, "utf-8")
let jsFiles = readdirSync(jsDir, "utf-8")

const BODY_START = "<body>"
const HEAD_END = "</head>"

let linkedScripts = []

for (let i = 0; i < jsFiles.length; i++) {
  const element = jsFiles[i]
  if (/\.js$/.test(element)) {
    let content = readFileSync(resolve(jsDir, element), "utf-8")

    if (/^runtime~/.test(element)) {
      unlinkSync(join(jsDir, element))
      html = html.replace(
        BODY_START,
        `${BODY_START}<script>${content}</script>`
      )
    } else {
      let publicPath = `/js/${element}`
      html = html.replace(
        HEAD_END,
        `<link rel="preload" href="${publicPath}" as="script" />${HEAD_END}`
      )
      linkedScripts.push(publicPath)
    }
  }
}

const APP_ROOT = '<div id="root"></div>'

let scripts = linkedScripts
  .map(s => `<script src="${s}" async defer></script>`)
  .join("")

html = html.replace(APP_ROOT, `${APP_ROOT}${scripts}`)

writeFileSync(htmlPath, html)
