import { getPost } from '~/markdown/utils/fs'
import feed from './feed'
import { spawnSync } from 'node:child_process'
import { createIssues } from './issues'
import optimizeDevCode from './optimize'

export type FileMap = Record<string, string>

const PostRegx = /\s*[AD]\s*"?data\/posts\/(blog|life|note|summary)\/.*/

async function run() {
  const status = spawnSync('git', ['status', '-s']).stdout.toString()
  if (PostRegx.test(status)) {
    const posts = await getPost()
    await feed(posts)
    await createIssues(posts)
  }
  await optimizeDevCode()
}

run()
