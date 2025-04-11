import { transform, type Options } from 'sucrase'
import minifyCodeSync from '~/optimize/minify-code'

const transfromOptions: Options = {
  transforms: ['jsx', 'typescript', 'imports'],
  production: true,
}
export function sucraseParse(code: string, options = transfromOptions) {
  const compiled = transform(code, options ?? transfromOptions).code
  if (process.env.NODE_ENV === 'development') {
    return compiled
  }
  return minifyCodeSync(compiled)
}
