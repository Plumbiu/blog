import { Feed } from 'feed'
import type { PostList } from '~/markdown/types'
import {
  BlogAuthor,
  BlogDesc,
  BlogTitle,
  BlogUrl,
  BlogCopyRight,
  Email,
} from '~/config/site'
import { joinWebUrl } from '@/app/seo'
import { writeFileWithGit } from './utils'

async function feed(posts: PostList[]) {
  const feed = new Feed({
    title: BlogTitle,
    description: BlogDesc,
    id: BlogUrl,
    link: BlogUrl,
    copyright: BlogCopyRight,
    image: `${BlogUrl}avatar.jpg`,
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
  await writeFileWithGit(paths[0], feed.rss2())
  await writeFileWithGit(paths[1], feed.json1())
  await writeFileWithGit(paths[2], feed.atom1())
}

export default feed
