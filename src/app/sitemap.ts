import { MetadataRoute } from 'next'
import { getPostList } from '@/utils/node/markdown'
import { PostDir } from '@/constants'
import { MAX_PAGE_SIZE } from '@/app/list/constants'
import { joinWebUrl } from './seo'

function lastModified(date: string | number): string {
  return new Date(date).toISOString().split('T')[0]
}

async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = Date.now()
  const routes: MetadataRoute.Sitemap = [
    '',
    'list',
    'links',
    'about',
    ...PostDir.map((dir) => `list/${dir}`),
  ].map((route) => ({
    url: joinWebUrl(route),
    lastModified: lastModified(now),
  }))

  await Promise.all(
    PostDir.map(async (dir) => {
      const post = await getPostList(dir)
      for (let i = 1; i <= Math.ceil(post.length / MAX_PAGE_SIZE); i++) {
        routes.push({
          url: joinWebUrl('list', dir, i),
          lastModified: lastModified(now),
        })
      }
      post.forEach((post) => {
        routes.push({
          url: joinWebUrl('posts', dir, post.path),
          lastModified: new Date(post.meta.date).toISOString(),
        })
      })
    }),
  )

  return routes
}

export default sitemap
