export async function useGet<T>(suffix: string) {
  const raw = await fetch(process.env.API_URL + suffix)
  const data: T = await raw.json()
  return data
}

export async function usePost<T>(suffix: string, payload: any) {
  const raw = await fetch(process.env.API_URL + suffix, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const data: T = await raw.json()
  return data
}
