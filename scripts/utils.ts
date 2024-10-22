import { spawnSync } from 'child_process'
import pc from 'picocolors'

export function gitadd(path: string) {
  spawnSync('git', ['add', path])
  console.log(pc.green(`${path} added`))
}
