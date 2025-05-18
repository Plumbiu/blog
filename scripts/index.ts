import { getPost } from '~/markdown/utils/fs'
import feed from './feed'
import { createIssues } from './issues'
import { getPostStatus } from './utils'

async function run() {
  const status = getPostStatus()
  if (status.a || status.d || status.m) {
    const posts = await getPost()
    if (status.a || status.d) {
      await createIssues(posts)
    }
    if (status.m) {
      await feed(posts)
    }
  }
}

run()
