import { Octokit } from 'octokit'
import { NextResponse } from 'next/server'

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
    const { data: rawIssues } = await octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner: 'Plumbiu',
      repo: 'blog_comments',
    })
    const issues = rawIssues.map(({ title }) => title)
    const title = JSON.stringify({ date, name })
    if (issues.includes(title)) {
      throw new Error('请勿同一天留言多次！')
    }
    await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner: 'Plumbiu',
      repo: 'blog_comments',
      title,
      body: words,
    })
    return NextResponse.json({ msg: '评论成功！', type: 'success' })
  } catch (err: any) {
    return NextResponse.json({ msg: err.message, type: 'error' })
  }
}
