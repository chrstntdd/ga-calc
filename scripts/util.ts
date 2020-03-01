import { existsSync, mkdirSync } from "fs"
import { dirname } from "path"

export function makeDirIfNonExistent(path: string) {
  let dir = dirname(path)
  !existsSync(dir) && mkdirSync(dir, { recursive: true })
}
