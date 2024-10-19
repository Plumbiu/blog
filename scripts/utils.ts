import { spawnSync } from 'child_process'

export function gitadd(path: string) {
  const child = spawnSync('git', ['add', path])
  console.log(child.output.toString())
}
