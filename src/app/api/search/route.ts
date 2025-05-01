import getSearchApiData from '@/lib/node/search-data'

export async function GET() {
  const data = await getSearchApiData()

  return Response.json(data)
}
