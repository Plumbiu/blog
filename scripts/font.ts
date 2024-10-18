/* eslint-disable @stylistic/quotes */
import fsp from 'node:fs/promises'
import Fontmin from 'fontmin'
import { getPosts } from './utils'

async function run() {
  const paths = await getPosts()
  const set = new Set<string>()
  await Promise.all(
    paths.map(async (p) => {
      const content = await fsp.readFile(p, 'utf-8')
      for (const ch of content) {
        set.add(ch)
      }
    }),
  )
  const uni = [...set].join('')
  const fontmin = new Fontmin()
    .src('assets/fonts/*.ttf')
    .use(
      Fontmin.glyph({
        // eslint-disable-next-line @stylistic/max-len
        text: `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_\`abcdefghijklmnopqrstuvwxyz{|}`,
        // hinting: false, // keep ttf hint info (fpgm, prep, cvt). default = true
      }),
    )
    .use(Fontmin.ttf2woff2())
    .dest('src/fonts')

  fontmin.run(function (err, files) {
    if (err) {
      throw err
    }
  })
}

run()
