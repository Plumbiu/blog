export function apiURL(suffix: string) {
  return process.env.API_URL + suffix
}

export async function request<T>(url: string) {
  const raw = await fetch(apiURL(url))
  const data: T = await raw.json()
  return data
}
