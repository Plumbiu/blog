import path from 'node:path'
import Pageres from 'pageres'
import { readJSON } from './utils.js'

async function screenshots() {
  const friends = await readJSON(
    path.join(process.cwd(), 'config', 'friends.json'),
  )
  for (const friend of friends) {
    await new Pageres({ delay: 2, filename: friend.name })
      .source(friend.link, ['1920x1080'], { crop: 1080 })
      .destination('public/friends/screenshots')
      .run()
  }
}

screenshots()
