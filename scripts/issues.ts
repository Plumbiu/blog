import fsp from 'node:fs/promises'
import issueMap from '~/data/issues.json'
import { GithubName, GithubRepoName } from '~/data/site'

const update_issue = process.env.UPDATE_ISSUE === 'true'

export async function createIssues() {
  const allIssues: any[] = await fetch(
    `https://api.github.com/repos/${GithubName}/${GithubRepoName}/issues`,
  ).then((res) => res.json())
  const issues = allIssues.filter((issue) =>
    issue.title.startsWith('[comment] '),
  )
  const postIssues: string[] = []
  for (const issue of issues) {
    const key = issue.title.replace('[comment] posts/', '')
    if (!issueMap[key]) {
      postIssues.push(issue.title)
    }
  }

  const files = await fsp.readFile('.env.local', 'utf-8')
  const envs = files.split(/\r?\n/g)
  let shouldUpdate = true
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
              shouldUpdate = false
            })
        }),
      )
      if (shouldUpdate) {
        await fsp.writeFile('data/issues.json', JSON.stringify(issueMap))
      }
    }
  }
}

if (update_issue) {
  createIssues()
}
