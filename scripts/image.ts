import fsp from 'node:fs/promises'
import path from 'node:path'
import { imageMeta } from 'image-meta'
import pc from 'picocolors'
import { FileMap } from '.'

interface IIMage {
  w: number
  h: number
}

const MediaRegx = /.png|jpg|jpeg|gif|png|svg|webp$/

async function generateImageInfo(fileMap: FileMap) {
  const result: Record<string, IIMage> = {}

  const regx =
    /(http(s?):)([/|.|\w|\s|-])*\.(?:png|jpg|jpeg|gif|png|svg|webp)/gi
  const urls = []
  const localRegx = /\!\[[^\]]*\]\((\/assets\/images\/[^\)]*)\)/gi
  let m
  for (const p in fileMap) {
    const content = fileMap[p]
    while ((m = regx.exec(content))) {
      const url = m[0]
      if (url) {
        urls.push({ url, isLocal: false, key: url })
      }
    }

    while ((m = localRegx.exec(content))) {
      const url = m[1]
      if (url && MediaRegx.test(url)) {
        const filePath = path.join(process.cwd(), 'public', url)
        urls.push({ url: filePath, isLocal: true, key: url })
      }
    }
  }

  await Promise.all(
    urls.map(async ({ url, isLocal, key }) => {
      try {
        let buffer: ArrayBuffer
        if (isLocal) {
          buffer = await fsp.readFile(url)
        } else {
          buffer = await fetch(url, {}).then((res) => res.arrayBuffer())
        }
        const { width, height } = imageMeta(new Uint8Array(buffer))
        if (width && height) {
          result[key] = { w: width, h: height }
          console.log(pc.green('Successful: ') + url)
        }
      } catch (error: any) {
        console.log(pc.red('Error: ') + url + ' ' + error.message)
      }
    }),
  )
  const imageInfoPath = './src/image-info.json'
  await fsp.writeFile('./src/image-info.json', JSON.stringify(result))
  return imageInfoPath
}

export default generateImageInfo
