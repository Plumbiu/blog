import type { MetadataRoute } from 'next'
import { getPostByPostType } from '@/lib/node/markdown'
import { PostDir } from '@/constants'
import { MAX_PAGE_SIZE } from '@/app/list/[...slug]/constants'
import { joinWebUrl } from './seo'

function lastModified(date: string | number): string {
  return new Date(date).toISOString().split('T')[0]
}

export const dynamic = 'force-static'

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
      const post = await getPostByPostType(dir)
      for (let i = 1; i <= Math.ceil(post.length / MAX_PAGE_SIZE); i++) {
        routes.push({
          url: joinWebUrl('list', dir, i),
          lastModified: lastModified(now),
        })
      }
      post.forEach((post) => {
        routes.push({
          url: joinWebUrl(post.path),
          lastModified: new Date(post.meta.date).toISOString(),
        })
      })
    }),
  )

  return routes
}

export default sitemap
