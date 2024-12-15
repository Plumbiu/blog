import { spawnSync } from 'node:child_process'
import pc from 'picocolors'

function newLine() {
  console.log()
}

export function gitadd(path: string | string[]) {
  newLine()
  path = Array.isArray(path) ? path : [path]
  for (const p of path) {
    spawnSync('git', ['add', p])
    console.log(pc.green(`Add ${p}`))
  }
  newLine()
}
