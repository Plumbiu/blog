import path from 'node:path'
import fs from 'node:fs/promises'
import Pageres from 'pageres'
import { readJSON } from './utils.js'

async function updateJson() {
  const { web, tool } = await readJSON(
    path.join(process.cwd(), 'config', 'lab.json'),
  )
  const writePath = path.join(process.cwd(), 'public', 'lab')
  const labDir = await fs.readdir(writePath)
  const data = [...web, ...tool]
    .filter(({ title }) => !labDir.includes(`${title.replace('/', '-')}.png`))
    .map(({ title, link }) => ({
      title: title.replace('/', '-'),
      link,
    }))
  await Promise.all(
    data.map(async ({ title, link }) => {
      try {
        await new Pageres({ delay: 2, filename: title })
          .source(link, ['1920x1080'], { crop: 1080 })
          .destination('public/lab')
          .run()
      } catch (err) {
        console.log(err.message)
      }
    }),
  )
}

updateJson()
