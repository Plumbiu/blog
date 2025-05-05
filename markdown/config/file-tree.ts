import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tryReadFileSync } from '@/lib/node/fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const fileTreeDataRawMap: Record<string, any> = {
  demo: {
    markdown: {
      plugins: {
        'rehype.ts': r('../plugins/rehype/shiki/transformer.ts'),
        'remark.ts': r('../plugins/remark/code/title.ts'),
      },
      'utils.ts': r('../utils/meta-parse.ts'),
    },
    'utils.ts': `
export const isString(x: unkown): x is string => {
  typeof x === 'string'
}`.trim(),
    'package.json': r('../../package.json'),
    '.gitignore': r('../../.gitignore'),
  },
}

function r(p: string) {
  const filePath = path.join(__dirname, p)
  return tryReadFileSync(filePath)
}

export default fileTreeDataRawMap
