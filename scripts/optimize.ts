import path from 'node:path'
import fsp from 'node:fs/promises'
import { glob } from 'fast-glob'
import { minify } from 'terser'
import { minify as minifyHTML } from '@swc/html'
import { writeFileWithGit } from './utils'

export default async function optimizeDevCode() {
  const jsPaths = await glob('public/assets/**/dev.js')
  const htmlPaths = await glob('public/assets/**/dev.html')
  await Promise.all(
    jsPaths.map(async (jsPath) => {
      const dirname = path.dirname(jsPath)
      const content = await fsp.readFile(jsPath, 'utf-8')
      const writePath = path.join(dirname, 'index.js')
      const minified = (
        await minify(content, {
          compress: {
            ecma: 2018,
            ie8: false,
          },
        })
      ).code
      if (minified) {
        await writeFileWithGit(writePath, minified)
      }
    }),
  )

  await Promise.all(
    htmlPaths.map(async (htmlPath) => {
      const dirname = path.dirname(htmlPath)
      const content = await fsp.readFile(htmlPath, 'utf-8')
      const writePath = path.join(dirname, 'index.html')
      const minified = (
        await minifyHTML(content, {
          minifyJs: true,
        })
      ).code
      if (minified) {
        await writeFileWithGit(writePath, minified)
      }
    }),
  )
}
