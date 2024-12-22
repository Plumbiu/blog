export async function getTokenResponse(code: string | null) {
  if (code === null) {
    return {}
  }
  const clientID = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
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

  return tokenResponse
}
