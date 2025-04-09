import { minify_sync } from 'terser'

export default function minifyCodeSync(code: string) {
  code = code.replace('"use strict";', '')
  const mini = minify_sync(code, {
    compress: {
      ecma: 2018,
      ie8: false,
      unsafe_math: true,
      unsafe_methods: true,
      unsafe_proto: true,
    },
    mangle: { toplevel: true },
  }).code
  if (!mini) {
    return code
  }
  return mini
}
