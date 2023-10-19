import fs from 'node:fs/promises'
import { existsSync, readFile } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

async function resolveImage() {
  const postsPath = path.join(process.cwd(), 'posts')
  const mdImgPath = path.join(process.cwd(), 'public', 'markdown')
  const MDIMAGE = /!\[.*\]\((.*)\)/g
  const dirs = await fs.readdir(postsPath)
  for (const dir of dirs) {
    const md = await fs.readFile(path.join(postsPath, dir))
    const writePath = path.join(mdImgPath, dir)
    if (!existsSync(writePath)) {
      await fs.mkdir(writePath)
    } else {
      console.log(`have aleady exist ${writePath}\n`)
      continue
    }
    let url
    while ((url = MDIMAGE.exec(md)?.[1])) {
      const name = path.parse(url).name
      try {
        const raw = await (await fetch(url)).arrayBuffer()
        const img = Buffer.from(raw)
        const minify = sharp(Buffer.from(img)).resize(700)
        minify
          .webp({
            quality: 50,
          })
          .toFile(path.join(writePath, `${name}.webp`), (err) => {
            if (err) {
              console.log(err.message)
            }
          })
      } catch (err) {}
    }
  }
}

resolveImage()
