import fsp from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import pc from 'picocolors'
import { arrayify } from '@/utils/types'

export function gitadd(path: string | string[]) {
  path = arrayify(path)
  for (const p of path) {
    spawnSync('git', ['add', p])
    console.log(pc.cyan('[scripts] ') + 'git add ' + pc.green(`${p}`))
  }
}

export const writeFileWithGit = async (path: string, data: string) => {
  await fsp.writeFile(path, data)
  gitadd(path)
}
