import fsp from 'node:fs/promises'
import path from 'node:path'
import Pageres from 'pageres'

async function screenshots() {
  const raw = await fsp.readFile(
    path.join(process.cwd(), 'config', 'friends.json'),
    'utf-8',
  )
  const friends = JSON.parse(raw)
  for (const friend of friends) {
    await new Pageres({ filename: friend.name })
      .source(friend.link, ['1920x1080'], { crop: 1080 })
      .destination('public/friends/screenshots')
      .run()
  }
}

screenshots()
