import { initFields } from '@plumbiu/github-info'

export async function useUserInfo() {
  const { followersField, followingField, reposField } =
    await initFields('Plumbiu')
  return {
    followers: await followersField(),
    following: await followingField(),
    public_repos: await reposField(),
  }
}

export async function useEventInfo() {
  const { eventsField } = await initFields('Plumbiu')
  return await eventsField()
}
