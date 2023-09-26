import { initFields } from '@plumbiu/github-info'
import { NextResponse } from 'next/server'

export async function GET() {
  const { followersField, followingField, reposField } =
    await initFields('Plumbiu')
  return NextResponse.json({
    followers: await followersField(),
    following: await followingField(),
    public_repos: await reposField(),
  })
}
