import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getTokenResponse } from '../utils'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  let redirectUrl = `/assets/oauth/redirect/${
    process.env.NODE_ENV === 'development' ? 'dev' : 'index'
  }.html`
  try {
    const tokenResponse = await getTokenResponse(code)
    const accessToken = tokenResponse.access_token
    if (accessToken) {
      redirectUrl = `${redirectUrl}?access_token=${accessToken}`
      const user = await fetch('https://api.github.com/user', {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json())
      if (user) {
        redirectUrl = `${redirectUrl}&user_login=${user.login}&user_avatar=${user.avatar_url}`
      }
    }
  } catch (error) {
    console.log(error)
  }
  console.log(redirectUrl)
  redirect(redirectUrl)
}
