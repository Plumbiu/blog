import { getPostList, type PostList } from '@/utils/node/markdown'
import fsp from 'node:fs/promises'
import pc from 'picocolors'
import { GithubName, GithubRepoName } from '~/data/site'

const update_issue = process.env.UPDATE_ISSUE === 'true'

export async function createIssues(posts: PostList[]) {
  const allIssues: any[] = await fetch(
    `https://api.github.com/repos/${GithubName}/${GithubRepoName}/issues`,
  ).then((res) => res.json())
  const issues = allIssues.filter((issue) =>
    issue.title.startsWith('[comment] '),
  )
  const result: Record<string, number> = {}
  for (const issue of issues) {
    result[issue.title] = issue.number
  }

  const postIssues = posts
    .map((post) => {
      const issueName = `[comment] ${post.path}`
      return issueName
    })
    .filter((issueName) => !result[issueName])
  const files = await fsp.readFile('.env.local', 'utf-8')
  const envs = files.split(/\r?\n/g)

  for (const env of envs) {
    if (env.startsWith('GITHUB_TOKEN=')) {
      const token = env.split('=')[1].trim()
      const querylUrl = `https://api.github.com/repos/${GithubName}/${GithubRepoName}/issues`
      const issueMap: Record<string, number> = {}
      await Promise.all(
        postIssues.map(async (title) => {
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
            .catch(() => {
              console.log(
                `/data/issues.json 缺少\n${pc.bgCyan(postIssues.join('\n'))}`,
              )
              console.log(pc.cyan('请手动更新 /data/issue.json'))
            })
        }),
      )
      await fsp.writeFile('data/issues.json', JSON.stringify(issueMap))
    }
  }
}

;(async () => {
  if (update_issue) {
    const posts = await getPostList()
    createIssues(posts)
  }
})()
