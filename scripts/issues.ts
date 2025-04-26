import fsp from 'node:fs/promises'
import pc from 'picocolors'
import issueMap from '~/data/issues.json'
import { GithubName, GithubRepoName } from '~/config/site'
import type { PostList } from '~/markdown/types'
import { getPost } from '~/markdown/utils/fs'

const update_issue = process.env.UPDATE_ISSUE === 'true'

export async function createIssues(posts: PostList[]) {
  const allIssues: any[] = await fetch(
    `https://api.github.com/repos/${GithubName}/${GithubRepoName}/issues`,
  ).then((res) => res.json())
  const issues = allIssues.filter((issue) =>
    issue.title.startsWith('[comment] '),
  )
  let shouldUpdateLocalIssue = false
  const issueFullMap: Record<string, number> = issueMap
  const postsTitles = posts.map((post) => `[comment] ${post.path}`)
  for (const issue of issues) {
    const key = issue.title.replace('[comment] posts/', '')
    if (!issueMap[key]) {
      issueFullMap[key] = +issue.number
      shouldUpdateLocalIssue = true
    }
  }
  if (shouldUpdateLocalIssue) {
    await fsp.writeFile('data/issues.json', JSON.stringify(issueFullMap))
  }
  const updatedIssues: string[] = []
  const existenIssues = new Set(issues.map((issue) => issue.title))
  for (const title of postsTitles) {
    if (!existenIssues.has(title)) {
      updatedIssues.push(title)
    }
  }

  const files = await fsp.readFile('.env.local', 'utf-8')
  const envs = files.split(/\r?\n/g)
  for (const env of envs) {
    if (env.startsWith('GITHUB_TOKEN=')) {
      const token = env.split('=')[1].trim()
      const querylUrl = `https://api.github.com/repos/${GithubName}/${GithubRepoName}/issues`
      const issueMap: Record<string, number> = {}
      await Promise.all(
        updatedIssues.map(async (title) => {
          await fetch(querylUrl, {
            method: 'POST',
            headers: {
              accept: 'application/vnd.github.VERSION.html+json',
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title,
              body: 'You can leave comment here 😄',
              labels: ['comment'],
            }),
          })
            .then((data) => data.json())
            .then((data) => {
              const title = data.title
              const issueNumber = data.url.split('/').pop()
              issueMap[title.replace('[comment] posts/', '')] = +issueNumber
            })
            .catch((error: any) => {
              console.log(error)
              console.log(`缺少\n${pc.cyan(updatedIssues.join('\n'))}`)
              console.log(pc.cyan('请手动更新 /data/issue.json'))
            })
        }),
      )
    }
  }
}

async function run() {
  const posts = await getPost()
  await createIssues(posts)
}
if (update_issue) {
  run()
}
