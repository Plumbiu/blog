import { Octokit } from 'octokit'
import { blog_message_repo, github_name } from '@/lib/json'

const octokit = new Octokit({
  auth: process.env.OCTOKIT_TOKEN,
})

/*
  Message Route is processing, I dont't like the style before, so I delete it
*/
export async function POST(req: Request) {
  const { name, words, date } = (await req.json()) as IMessage
  try {
    if (!name || !words || !date) {
      throw new Error('字段不能为空')
    }
    const user = await octokit.request(`GET /users/${name}`)
    if (user.status !== 200) {
      throw new Error('请输入有效的 Github 用户名！')
    }
    const title = JSON.stringify({ date, name })
    await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner: github_name,
      repo: blog_message_repo,
      title,
      body: `@${name}\n${words}`,
    })

    return Response.json({ msg: '评论成功！', type: 'success' })
  } catch (err: any) {
    return Response.json({ msg: err.message, type: 'error' })
  }
}
