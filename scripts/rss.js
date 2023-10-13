import fsp from 'fs/promises'
import path from 'path'
import { toXML } from '../assets/js/jstoxml.js'
import { title, url, name, yourself } from '../config.json'
import { getPosts } from './utils.js'

/**
 * @param {Object} json
 */
const json = {
  channel: [
    { title },
    { link: url },
    { generator: `${name} - https://github.com/${name}` },
    { description: `${name} 的 material 风格博客` },
    { webMaster: yourself },
    { managingEditor: yourself },
    { language: 'zh-CN' },
    {
      'atom:link': {
        _attrs: {
          ' href': `${url}/rss.xml`,
          ref: 'self',
          type: 'application/rss+xml',
        },
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
    // @ts-ignore
    lastBuildDate: posts[0].date,
  })
  for (const post of posts) {
    const { title, desc: description, date: pubDate } = post
    json.channel.push({
      item: {
        // @ts-ignore
        title,
        link: `${url}/post/${title}`,
        pubDate,
        author: name,
        guid: `${url}/post/${title}`,
        description,
      },
    })
  }
  const xml = toXML({
    _name: 'rss',
    _attrs: {
      ' version': '2.0',
      'xmlns:atom': 'http://www.w3.org/2005/Atom',
    },
    _content: {
      channel: json.channel,
    },
  })
  await fsp.writeFile(path.join(process.cwd(), 'public', 'rss.xml'), xml)
}

resolve()
