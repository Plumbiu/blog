/* eslint-disable @stylistic/max-len */
import fsp from 'node:fs/promises'
import yaml from 'js-yaml'
import { imageMeta } from 'image-meta'
import pc from 'picocolors'
import { getPosts } from './utils'

interface FrontMatterItem {
  title: string
  date: Date | number
}

type FileMap = Record<string, string>
interface Frontmatter {
  note: Record<string, FrontMatterItem>
  life: Record<string, FrontMatterItem>
  blog: Record<string, FrontMatterItem>
  summary: Record<string, FrontMatterItem>
}
async function generateFrontMatter(fileMap: FileMap) {
  const result: Record<string, FrontMatterItem> = {}
  const Start_Str = '---'
  for (const p in fileMap) {
    const file = fileMap[p]
    const startIdx = file.indexOf(Start_Str)
    if (startIdx !== 0) {
      return
    }
    const endIndex = file.indexOf(Start_Str, 1)
    const parseString = file.slice(Start_Str.length, endIndex)
    const frontMatter = yaml.load(parseString) as FrontMatterItem
    frontMatter.date = new Date(frontMatter.date).valueOf()
    result[p.slice(0, p.length - 3)] = frontMatter
  }

  await fsp.writeFile('./src/front_matter.json', JSON.stringify(result))
  console.log(pc.bgGreenBright('Post update successfully') + '\n')
}

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

  await fsp.writeFile('./src/image-info.json', JSON.stringify(result))
}

async function generate() {
  const posts = await getPosts()

  const fileMap: FileMap = {}
  await Promise.all(
    posts.map(async (p) => {
      const file = await fsp.readFile(p, 'utf-8')
      fileMap[p] = file
    }),
  )
  await generateFrontMatter(fileMap)
  // await generateImageInfo(fileMap)
}

generate()
