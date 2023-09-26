import { initFields } from '@plumbiu/github-info'

export async function useUserInfo() {
  const { userField, followersField, followingField, reposField } =
    await initFields('Plumbiu')
  return {
    user: await userField(),
    followers: await followersField(),
    following: await followingField(),
    public_repos: await reposField(),
  }
}

export async function useEventInfo() {
  const { eventsField } = await initFields('Plumbiu')
  return await eventsField()
}
