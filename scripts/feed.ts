import fsp from 'fs/promises'
import { toXML } from 'jstoxml'
import { PostList } from '@/utils/node/markdown'
import { BlogAuthor, BlogUrl, GithubName } from '~/data/site'

async function feed(posts: PostList[]) {
  const json: Record<string, any> = {
    channel: [
      { title: `${BlogAuthor} の 小屋` },
      { link: BlogUrl },
      { generator: `https://github.com/${GithubName}` },
      { description: `${BlogAuthor} 的博客` },
      {
        'atom:link': {
          _attrs: {
            ' href': `${BlogUrl}/rss.xml`,
            ref: 'self',
            type: 'application/rss+xml',
          },
        },
      },
    ],
  }

  json.channel.push({
    lastBuildDate: posts[0].meta.date,
  })
  for (const post of posts) {
    const { title, desc: description, date: pubDate } = post.meta
    const linkUrl = `${BlogUrl}${post.path}`
    json.channel.push({
      item: {
        title,
        link: linkUrl,
        pubDate,
        author: BlogAuthor,
        guid: linkUrl,
        description,
      },
    })
  }
  const xml = toXML({
    _name: 'rss',
    _attrs: {
      version: '2.0',
      'xmlns:atom': 'http://www.w3.org/2005/Atom',
    },
    _content: {
      channel: json.channel,
    },
  })
  const rssPath = 'public/rss.xml'
  await fsp.writeFile(rssPath, xml)
  return rssPath
}

export default feed
