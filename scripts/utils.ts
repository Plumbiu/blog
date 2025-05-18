import fsp from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import pc from 'picocolors'
import { arrayify } from '@/lib/types'

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

const PostPathRegx = /posts\/(blog|life|note|summary)\/.*/

export function getPostStatus() {
  const msg = spawnSync('git', ['status', '-s']).stdout.toString()
  const status = msg.split('\n')
  const postStatus = {
    m: false,
    a: false,
    d: false,
  }
  for (const item of status) {
    const line = item.trim()
    const [s, ...p] = line.split(' ')
    const trimP = p.join('').trim()
    if (trimP.endsWith('.md') && PostPathRegx.test(trimP)) {
      if (!postStatus.m) {
        postStatus.m = s.includes('M')
      }
      if (!postStatus.a) {
        postStatus.a = s.includes('A')
      }
      if (!postStatus.d) {
        postStatus.d = s.includes('D')
      }
    }
  }
  return postStatus
}
