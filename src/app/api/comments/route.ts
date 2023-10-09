import { Octokit } from 'octokit'
import { NextResponse } from 'next/server'

const octokit = new Octokit({
  auth: process.env.OCTOKIT_TOKEN,
})

export async function POST(req: Request) {
  const messages = await req.json()
  console.log(messages)
  try {
    const user = await octokit.request('GET /users/fadsfadflumbiu')
    console.log({ user })

    await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner: 'Plumbiu',
      repo: 'blog_comments',
      title: 'Created with the REST API',
      body: 'This is a test issue created by the REST API',
    })
    return NextResponse.json({ message: 'ok' })
  } catch {
    return NextResponse.json({ message: 'error' })
  }
}
