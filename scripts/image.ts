import fsp from 'node:fs/promises'
import path from 'node:path'
import { imageMeta } from 'image-meta'
import pc from 'picocolors'
import sharp from 'sharp'
import _imageInfo from '@/image-info.json'
import { getPathInfo } from '@/utils'
import { FileMap } from '.'

type ImageInfo = Record<string, number[]>

const imageInfo: ImageInfo = _imageInfo

const MediaRegx = /.png|jpg|jpeg|gif|png|svg|webp$/

async function generateImageInfo(fileMap: FileMap) {
  const regx =
    /(http(s?):)([/|.|\w|\s|-])*\.(?:png|jpg|jpeg|gif|png|svg|webp)/gi
  const urls = []
  const localRegx = /\!\[[^\]]*\]\((\/assets\/images\/[^\)]*)\)/gi
  let m
  for (const p in fileMap) {
    const content = fileMap[p]
    while ((m = regx.exec(content))) {
      const url = m[0]
      if (url && !imageInfo[url]) {
        urls.push({ url, isLocal: false, key: url })
      }
    }

    while ((m = localRegx.exec(content))) {
      const url = m[1]
      if (url && MediaRegx.test(url) && !imageInfo[url]) {
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
          const { basename } = getPathInfo(key)
          imageInfo[basename] = [width, height]
          console.log(pc.green('Successful: ') + url)
        }
      } catch (error: any) {
        console.log(pc.red('Error: ') + url + ' ' + error.message)
      }
    }),
  )
  const imageInfoPath = './src/image-info.json'
  await fsp.writeFile('./src/image-info.json', JSON.stringify(imageInfo))
  return imageInfoPath
}

export async function generateImageSize() {
  const rootPath = path.join(process.cwd(), 'public', 'assets', 'images')
  const images = await fsp.readdir(rootPath, { withFileTypes: true })
  await Promise.all(
    images.map(async (p) => {
      if (p.isFile()) {
        const filename = p.name
        if (filename.endsWith('.gif')) {
          return
        }
        const imagePath = path.join(rootPath, filename)
        console.log(imagePath)
        const buffer = await fsp.readFile(imagePath)
        const byte = buffer.length / 1024
        const data = await sharp(buffer)
          .webp({ quality: 40 })
          .blur(byte / 1.5)
          .toBuffer()
        await fsp.writeFile(path.join(rootPath, 'blur', filename), data)
      }
    }),
  )
}

export default generateImageInfo
