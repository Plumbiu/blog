import sharp from 'sharp'
import { minify_sync } from 'terser'

export function minifyCodeSync(code: string) {
  code = code.replace('"use strict";', '')
  const mini = minify_sync(code, {
    compress: {
      ecma: 2018,
      ie8: false,
    },
    mangle: { toplevel: true },
  }).code
  if (!mini) {
    return code
  }
  return mini
}

export async function getBlurDataUrl(filePath: string) {
  const image = sharp(filePath)
  const metadata = await image.metadata()
  const originWidth = metadata.width
  const originHeight = metadata.height
  if (!originHeight || !originWidth) {
    return {}
  }
  const resizedSize = 14
  const resizedImage = image.resize({
    width: Math.min(originWidth, resizedSize),
    height: Math.min(originHeight, resizedSize),
    fit: 'inside',
  })
  const output = resizedImage.webp({
    quality: 20,
    alphaQuality: 20,
    smartSubsample: true,
  })

  const { data } = await output.toBuffer({ resolveWithObject: true })

  return {
    base64: `data:image/webp;base64,${data.toString('base64')}`,
    metadata,
  }
}

