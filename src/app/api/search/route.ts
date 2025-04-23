import { getPost } from '~/markdown/utils/fs'

const MaxDesc = 80

export async function GET() {
  const data = await getPost()

  for (const item of data) {
    item.next = undefined
    item.prev = undefined
    const desc = item.meta.desc
    if (desc) {
      item.meta.desc =
        desc.length > MaxDesc - 3 ? desc.slice(0, MaxDesc - 3) + '...' : desc
    }
  }
  return Response.json(data || [])
}
