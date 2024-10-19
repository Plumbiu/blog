import { spawnSync } from 'child_process'

export function gitadd(path: string) {
  spawnSync('git add', [path])
}
