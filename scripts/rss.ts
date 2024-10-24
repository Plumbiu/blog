import fsp from 'fs/promises'
import { toXML } from 'jstoxml'
import { PostInfo } from '@/utils/node'

const URL = 'https://blog.plumbiu.top'

async function generateRss(posts: PostInfo[]) {
  const json: Record<string, any> = {
    channel: [
      { title: 'Plumbiu の 小屋' },
      { link: URL },
      { generator: 'https://github.com/plumbiu' },
      { description: 'Plumbiu 的博客' },
      {
        'atom:link': {
          _attrs: {
            ' href': `${URL}/rss.xml`,
            ref: 'self',
            type: 'application/rss+xml',
          },
        },
      },
    ],
  }

  json.channel.push({
    lastBuildDate: posts[0].frontmatter.date,
  })
  for (const post of posts) {
    const { frontmatter } = post
    const { title, desc: description, date: pubDate } = frontmatter
    json.channel.push({
      item: {
        title,
        link: `${URL}/posts/${title}`,
        pubDate,
        author: 'Plumbiu',
        guid: `${URL}/posts/${title}`,
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

export default generateRss
