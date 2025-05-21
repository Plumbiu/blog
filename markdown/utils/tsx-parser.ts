import { transform, type Options } from 'sucrase'
import minifyCodeSync from '~/optimize/minify-code'

const transfromOptions: Options = {
  transforms: ['jsx', 'typescript', 'imports'],
  production: true,
}
export function parseTsx(
  code: string,
  options: Options = transfromOptions,
) {
  const compiled = transform(code, options).code.replace(
    'Object.defineProperty(exports, "__esModule", {value: true});',
    '',
  )

  if (process.env.NODE_ENV === 'development') {
    return compiled
  }
  return minifyCodeSync(compiled)
}
