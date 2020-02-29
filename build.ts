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
import { minify as terserMinify } from "terser"

import { makeDirIfNonExistent } from "./util"
import { preRenderApp } from "./pre-render-app"

const outDir = join(__dirname, "dist")
const jsDir = join(outDir, "js")
const htmlPath = join(outDir, "index.html")

const HEAD_END = "</head>"
const APP_ROOT = '<div id="root"></div>'
const first = "runtime~"

let linkedScripts = []
;(async function main() {
  let html = readFileSync(htmlPath, "utf-8")
  let jsFiles = readdirSync(jsDir, "utf-8")

  // Move runtime to first position
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
    .map(s => `<script src="${s}" async ></script>`)
    .join("")

  const BODY_END = "</body>"

  html = html.replace(BODY_END, `${scripts}${BODY_END}`)

  html = await preRenderApp(html)

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

  /**
   * @description
   * Move service worker to the root public path to allow all static assets
   * to be in scope of the SW.
   */

  const swSource = readFileSync(
    join(__dirname, "build", "client", "service-worker.js"),
    "utf-8"
  )

  let updatedSwSource = swSource.replace(
    'let offlineFundamentals = ["./"]',
    `let offlineFundamentals = ["./", "/images/webmanifest.json", ${linkedScripts
      .map(s => `"${s}"`)
      .join(",")}]`
  )

  writeFileSync(join(outDir, "sw.js"), terserMinify(updatedSwSource).code)
})()

function copyFile(src: string, dest: string) {
  let readStream = createReadStream(src)

  readStream.pipe(createWriteStream(dest))
}
