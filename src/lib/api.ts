import { url } from '@/lib/json'

const queryURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/'
    : `${url}/api/`

export async function useGet<T>(suffix: string) {
  const raw = await fetch(queryURL + suffix)
  const data: T = await raw.json()

  return data
}

export async function usePost<T>(suffix: string, payload: any) {
  const raw = await fetch(queryURL + suffix, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const data: T = await raw.json()

  return data
}
