import { Octokit } from 'octokit'

const octokit = new Octokit({
  auth: process.env.OCTOKIT_TOKEN,
})

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
      owner: 'Plumbiu',
      repo: 'blog_message',
      title,
      body: `@${name}\n${words}`,
    })

    return Response.json({ msg: '评论成功！', type: 'success' })
  } catch (err: any) {
    return Response.json({ msg: err.message, type: 'error' })
  }
}
