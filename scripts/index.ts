import fsp from 'node:fs/promises'
import { getPostList } from '@/utils/node/markdown'
import feed from './feed'
import { writeFileWithGit } from './utils.js'
import { minify } from 'terser'
import { minify as minifyHTML } from '@swc/html'
import { spawnSync } from 'node:child_process'
import { createIssues } from './issues'

export type FileMap = Record<string, string>

const PostRegx = /\s*[AD]\s*"?data\/posts\/(blog|life|note|summary)\/.*/

async function run() {
  const status = spawnSync('git', ['status', '-s']).stdout.toString()
  if (PostRegx.test(status)) {
    const posts = await getPostList()
    await feed(posts)
    await createIssues(posts)
  }
  const themeCode = await fsp.readFile('public/assets/theme/dev.js', 'utf-8')
  const minifiedThmeCode = await minify(themeCode, {
    compress: {
      ecma: 2018,
      ie8: false,
    },
  })
  const oauthRedirectHTML = await fsp.readFile(
    'public/assets/oauth/redirect/dev.html',
  )
  const minifiedOauthRedirectHTML = (await minifyHTML(oauthRedirectHTML)).code
  const themePath = 'public/assets/theme/index.js'
  const oauthRedirectHTMLPath = 'public/assets/oauth/redirect/index.html'
  if (minifiedThmeCode.code && minifiedOauthRedirectHTML) {
    await writeFileWithGit(themePath, minifiedThmeCode.code)
    await writeFileWithGit(oauthRedirectHTMLPath, minifiedOauthRedirectHTML)
  }
}

run()
