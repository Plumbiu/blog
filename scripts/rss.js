import fsp from 'fs/promises'
import path from 'path'
import { toXML } from '../assets/js/jstoxml.js'
import { getPosts, readJSON } from './utils.js'

async function resolve() {
  const { title, url, name, yourself } = readJSON(
    path.join(process.cwd(), 'config.json'),
  )
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

  const posts = await getPosts()

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
