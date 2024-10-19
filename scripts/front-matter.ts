import fsp from 'node:fs/promises'
import { FrontMatterItem, getFrontmatter } from '@/utils/node'

export type FileMap = Record<string, string>
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
  return mdPath
}

export default generateFrontMatter
