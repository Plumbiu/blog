import fsp from 'node:fs/promises'
import { Feed } from 'feed'
import type { PostList } from '@/utils/node/markdown'
import {
  BlogAuthor,
  BlogDesc,
  BlogTitle,
  BlogUrl,
  BlogCopyRight,
  Email,
} from '~/data/site'
import { joinWebUrl } from '@/app/seo'

async function feed(posts: PostList[]) {
  const feed = new Feed({
    title: BlogTitle,
    description: BlogDesc,
    id: BlogUrl,
    link: BlogUrl,
    copyright: BlogCopyRight,
    updated: new Date(2013, 6, 14), // optional, default = today
    feedLinks: {
      json: joinWebUrl('feed.json'),
      atom: joinWebUrl('feed.atom'),
      xml: joinWebUrl('feed.xml'),
    },
    author: {
      name: BlogAuthor,
      email: Email,
      link: joinWebUrl('about'),
    },
  })

  posts.forEach(({ meta, path }) => {
    if (!meta.hidden) {
      feed.addItem({
        title: meta.title,
        id: path,
        link: joinWebUrl(path),
        description: meta.desc,
        date: new Date(meta.date),
      })
    }
  })

  const paths = ['rss.xml', 'rss.json', 'rss.atom'].map((p) => `public/${p}`)
  await fsp.writeFile(paths[0], feed.rss2())
  await fsp.writeFile(paths[1], feed.json1())
  await fsp.writeFile(paths[2], feed.atom1())
  return paths
}

export default feed
