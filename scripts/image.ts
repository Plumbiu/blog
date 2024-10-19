import fsp from 'node:fs/promises'
import { imageMeta } from 'image-meta'
import pc from 'picocolors'
import { FileMap } from '.'

interface IIMage {
  w: number
  h: number
}
async function generateImageInfo(fileMap: FileMap) {
  const result: Record<string, IIMage> = {}

  const regx =
    /(http(s?):)([/|.|\w|\s|-])*\.(?:png|jpg|jpeg|gif|png|svg|webp)/gi
  const urls = []
  let m
  for (const p in fileMap) {
    const content = fileMap[p]
    while ((m = regx.exec(content))) {
      const url = m[0]
      if (url) {
        urls.push(url)
      }
    }
  }

  await Promise.all(
    urls.map(async (url) => {
      try {
        const buffer = await fetch(url).then((res) => res.arrayBuffer())
        const { width, height } = imageMeta(new Uint8Array(buffer))
        if (width && height) {
          result[url] = { w: width, h: height }
          console.log(pc.green('Successful: ') + url)
        }
      } catch (error) {
        console.log(pc.red('Error: ') + url)
      }
    }),
  )
  const imageInfoPath = './src/image-info.json'
  await fsp.writeFile('./src/image-info.json', JSON.stringify(result))
  return imageInfoPath
}

export default generateImageInfo
