/* eslint-disable @stylistic/max-len */
import fsp from 'node:fs/promises'
import { $ } from 'execa'
import { imageMeta } from 'image-meta'
import pc from 'picocolors'
import { getFrontmatter, getMarkdownPath } from '@/utils/node'

interface FrontMatterItem {
  title: string
  date: Date | number
}

type FileMap = Record<string, string>
async function generateFrontMatter(fileMap: FileMap) {
  const result: Record<string, FrontMatterItem> = {}
  for (const p in fileMap) {
    const file = fileMap[p]
    const { frontmatter } = getFrontmatter(file)
    if (!frontmatter) {
      continue
    }
    frontmatter.date = new Date(frontmatter.date).valueOf()
    result[p.slice(0, p.length - 3)] = frontmatter
  }
  const mdPath = './src/front_matter.json'
  await fsp.writeFile(mdPath, JSON.stringify(result))
  $`git add ${mdPath}`
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
  const posts = await getMarkdownPath()
  const fileMap: FileMap = {}
  await Promise.all(
    [...posts].map(async (p) => {
      const file = await fsp.readFile(p, 'utf-8')
      fileMap[p] = file
    }),
  )
  await generateFrontMatter(fileMap)
}

generate()
