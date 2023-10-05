import { toXML } from '../assets/js/jstoxml.js'
import fsp from 'fs/promises'
import { getPosts } from './utils.js'
import path from 'path'

const json = {
  channel: [
    { title: 'Plumbiu の 小屋' },
    { link: 'https://blog.plumbiu.top' },
    { generator: 'Plumbiu - https://github.com/Plumbiu/blog' },
    { description: 'Plumbiu 的 material 风格博客' },
    { webMaster: 'plumbiuzz@gmail.com(Plumbiu)' },
    { managingEditor: 'plumbiuzz@gmail.com(Plumbiu)' },
    { language: 'zh-CN' },
    {
      'atom:link': {
        _attrs: [
          {
            href: 'https://blog.plumbiu.top/rss.xml',
          },
          {
            ref: 'self',
          },
          {
            type: 'application/rss+xml',
          },
        ],
      },
    },
    { item: [] },
  ],
}

async function resolve() {
  const posts = await getPosts()
  genItems(posts)
}

/**
 * @param {Object[]} posts
 * @param {string} posts[].id
 * @param {string} posts[].desc
 * @param {string} posts[].title
 * @param {string} posts[].date
 * @param {string} posts[].updated
 * @param {string[]} posts[].tags
 * @param {string[]} posts[].categories
 */
async function genItems(posts) {
  json.channel.push({
    lastBuildDate: posts[0].date,
  })
  for (const post of posts) {
    const { title, desc: description, date: pubDate } = post
    json.channel.push({
      item: {
        title,
        link: `https://blog.plumbiu.top/post/${title}`,
        pubDate,
        author: 'Plumbiu',
        guid: `https://blog.plumbiu.top/post/${title}`,
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
  console.log({ xml })
  await fsp.writeFile(path.join(process.cwd(), 'public', 'rss.xml'), xml)
}

resolve()
