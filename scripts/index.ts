import fsp from 'node:fs/promises'
import { getPostList } from '@/utils/node/markdown'
import feed from './feed'
import { writeFileWithGit } from './utils.js'
import { minify } from 'terser'
import { spawnSync } from 'node:child_process'
import { createIssues } from './issues'

export type FileMap = Record<string, string>

const PostRegx = /\s*[AD]\s*"?data\/posts\/(blog|life|note|summary)\/.*/

async function run() {
  const status = spawnSync('git', ['status', '-s']).stdout.toString()
  if (PostRegx.test(status)) {
    const code = await fsp.readFile('public/assets/dev/theme.js', 'utf-8')
    const mini = await minify(code, {
      compress: {
        ecma: 2018,
        ie8: false,
      },
    })
    const posts = await getPostList()
    const themePath = 'public/assets/theme.js'
    if (mini.code) {
      await writeFileWithGit(themePath, mini.code)
    }
    await feed(posts)
    await createIssues(posts)
    console.log()
  }
}

run()
