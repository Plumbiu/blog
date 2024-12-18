import fsp from 'node:fs/promises'
import { getPostList } from '@/utils/node/markdown'
import feed from './feed'
import { writeFileWithGit } from './utils.js'
import { minify } from 'terser'

export type FileMap = Record<string, string>

async function run() {
  const code = await fsp.readFile('scripts/theme.js', 'utf-8')
  const mini = await minify(code, {
    compress: {
      ecma: 2018,
      ie8: false,
    },
  })
  const posts = await getPostList()
  const themePath = 'public/theme.js'
  if (mini.code) {
    await writeFileWithGit(themePath, mini.code)
  }
  await feed(posts)
  console.log()
}

run()
