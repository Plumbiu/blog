import getSearchData from '@/lib/node/search-data'

export async function GET() {
  const data = await getSearchData()

  return Response.json(data)
}
