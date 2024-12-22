import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  let redirectUrl = '/oauth/redirect.html'
  const clientID = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  try {
    const queryUrl =
      'https://github.com/login/oauth/access_token?' +
      `client_id=${clientID}&` +
      `client_secret=${clientSecret}&` +
      `code=${code}`
    const tokenResponse = await fetch(queryUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
    }).then((res) => res.json())
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
  redirect(redirectUrl)
}
