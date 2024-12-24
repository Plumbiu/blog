import type { NextRequest } from 'next/server'
import { createOAuthAppAuth } from '@octokit/auth-oauth-app'
import { Octokit } from 'octokit'

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')
  if (!token || !process.env.GITHUB_CLIENT_ID) {
    return new Response('error')
  }
  const octokit = new Octokit({
    authStrategy: createOAuthAppAuth,
    auth: {
      clientType: 'oauth-app',
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  })
  try {
    const verifyResponse = await octokit.request(
      'POST /applications/{client_id}/token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        access_token: token,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    )
    if (verifyResponse.status !== 200) {
      return new Response('error')
    }
    return new Response('ok')
  } catch (error) {
    return new Response('error')
  }
}
