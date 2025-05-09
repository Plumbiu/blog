import type { MetadataRoute } from 'next'
import { getPost } from '~/markdown/utils/fs'
import { Categoires } from '~/data/constants/categories'
import { MAX_PAGE_SIZE } from './list/[[...slug]]/constants'
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
    ...Categoires.map((dir) => `list/${dir}`),
  ].map((route) => ({
    url: joinWebUrl(route),
    lastModified: lastModified(now),
  }))

  await Promise.all(
    Categoires.map(async (dir) => {
      const post = await getPost(dir ? (post) => post.type === dir : undefined)
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
