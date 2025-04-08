import { readFileSync } from 'node:fs'
import { transform } from 'lightningcss'
import { globSync } from 'fast-glob'

export default function getReservedNamesClassnames() {
  const cssPaths = globSync('src/**/*.css', {
    ignore: ['**/*.module.css'],
  })
  const reversedClassNames: string[] = []
  cssPaths.forEach((path) => {
    const code = readFileSync(path)
    const { exports } = transform({
      cssModules: true,
      code,
      filename: '',
    })
    if (exports) {
      reversedClassNames.push(...Object.keys(exports))
    }
  })
  return reversedClassNames
}
