import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync
} from "fs"
import { join, resolve, basename, extname, dirname } from "path"
import { walkSync } from "@chrstntdd/node"

import { preRenderApp } from "./pre-render-app"

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

function makeDirIfNonExistent(path: string) {
  let dir = dirname(path)
  !existsSync(dir) && mkdirSync(dir, { recursive: true })
}
