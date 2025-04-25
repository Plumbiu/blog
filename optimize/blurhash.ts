import sharp from 'sharp'

export default async function getBlurDataUrl(filePath: string) {
  try {
    const image = sharp(filePath)
    const metadata = await image.metadata()
    const originWidth = metadata.width
    const originHeight = metadata.height
    if (!(originHeight && originWidth)) {
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
      base64: data.toString('base64'),
      metadata,
    }
  } catch (error) {
    return {}
  }
}
