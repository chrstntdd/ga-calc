import {
  createReadStream,
  createWriteStream,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync
} from "fs"
import { join, resolve, basename } from "path"
import { walkSync } from "@chrstntdd/node"

import { makeDirIfNonExistent } from "./util"
import { preRenderApp } from "./pre-render-app"

let outDir = join(__dirname, "dist")
let jsDir = join(outDir, "js")
const htmlPath = join(outDir, "index.html")

let html = readFileSync(htmlPath, "utf-8")
let jsFiles = readdirSync(jsDir, "utf-8")

const BODY_START = "<body>"
const HEAD_END = "</head>"
const APP_ROOT = '<div id="root"></div>'

let linkedScripts = []

const first = "runtime~"

jsFiles = jsFiles.sort((a, b) =>
  a.includes(first) ? -1 : b.includes(first) ? 1 : 0
)

for (let i = 0; i < jsFiles.length; i++) {
  const element = jsFiles[i]
  if (/\.js$/.test(element)) {
    let content = readFileSync(resolve(jsDir, element), "utf-8")

    if (/^runtime~/.test(element)) {
      unlinkSync(join(jsDir, element))
      html = html.replace(APP_ROOT, `${APP_ROOT}<script>${content}</script>`)
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

let scripts = linkedScripts
  .map(s => `<script src="${s}" async defer></script>`)
  .join("")

const BODY_END = "</body>"

html = html.replace(BODY_END, `${scripts}${BODY_END}`)

html = preRenderApp(html)

writeFileSync(htmlPath, html)

for (let { name } of walkSync(resolve(__dirname, "src/assets"), {
  includeDirs: false,
  includeFiles: true,
  filter: n => /\.png$/.test(n) || n.includes("webmanifest"),
  maxDepth: 2
})) {
  let destination = resolve(outDir, "images", basename(name))
  makeDirIfNonExistent(destination)
  copyFile(name, destination)
}

function copyFile(src: string, dest: string) {
  let readStream = createReadStream(src)

  readStream.pipe(createWriteStream(dest))
}
