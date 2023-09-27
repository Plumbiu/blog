export async function useRequest<T>(suffix: string) {
  const raw = await fetch(process.env.API_URL + suffix)
  const data: T = await raw.json()
  return data
}
