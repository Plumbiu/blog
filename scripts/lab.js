import path from 'node:path'
import fs from 'node:fs/promises'
import sharp from 'sharp'
import { readJSON } from './utils.js'

async function updateJson() {
  const { web, tool } = await readJSON(
    path.join(process.cwd(), 'config', 'lab.json'),
  )
  const writePath = path.join(process.cwd(), 'public', 'lab')
  const labDir = await fs.readdir(writePath)
  const data = [...web, ...tool]
    .filter(({ title }) => !labDir.includes(title))
    .map(({ title, link }) => ({
      title,
      link,
    }))
  for (const { title, link } of data) {
    try {
      const raw = await (await fetch(link)).arrayBuffer()
      const minify = sharp(raw)
      minify
        .webp({
          quality: 50,
        })
        .toFile(path.join(writePath, `${title}.webp`), (err) => {
          if (err) {
            console.log(err.message)
          }
        })
    } catch (err) {
      console.log(err.message)
    }
  }
}

updateJson()
