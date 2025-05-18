import type { SearchData } from '@/components/layout/SearchPanel'
import { getPost } from '~/markdown/utils/fs'
import stripMarkdown from '~/markdown/utils/strip-markdown'

const MaxDesc = 80

export default async function getSearchApiData() {
  const posts = await getPost()
  const data: SearchData[] = []
  for (const item of posts) {
    const desc = stripMarkdown(item.meta.desc || '')
    if (desc) {
      item.meta.desc =
        desc.length > MaxDesc - 3 ? desc.slice(0, MaxDesc - 3) + '...' : desc
    }
    data.push({
      meta: {
        desc: item.meta.desc,
        title: item.meta.title,
        tags: item.meta.tags,
      },
      path: item.path,
      type: item.type,
    })
  }

  return data
}
