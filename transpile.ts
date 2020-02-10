import { readFileSync, writeFileSync } from "fs"
import { transformSync } from "@babel/core"
import { resolve, extname } from "path"
import { walkSync } from "@chrstntdd/node"

import { makeDirIfNonExistent } from "./util"

const babelCfg = require("./.babelrc.js")

const SOURCE_FILES = /\.m?[jt]sx?$/

main()

function main() {
  for (let { name } of walkSync(resolve(__dirname, "src"), {
    includeDirs: false,
    includeFiles: true,
    filter: n => !n.includes(".d.ts") && SOURCE_FILES.test(n)
  })) {
    let newName = name.replace("src", "build").replace(extname(name), ".js")
    let content = readFileSync(name, "utf8")
    let { code } = transformSync(content, {
      ...babelCfg,
      filename: name
    })
    makeDirIfNonExistent(newName)
    writeFileSync(newName, code)
  }
}
