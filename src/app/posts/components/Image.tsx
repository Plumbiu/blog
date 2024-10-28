import path from 'node:path'
import NextImage, { ImageProps } from 'next/image'
import lqip from 'lqip-modern'

interface IImage {
  src: string
  alt: string
  [key: string]: any
}

async function MarkdownImage(props: IImage) {
  const { src, alt, ...rest } = props
  const imagePath = path.join('public', src)
  const { metadata } = await lqip(imagePath)
  const commonProps: ImageProps = {
    ...rest,
    src,
    alt,
    style: {
      position: undefined,
      aspectRatio: metadata.originalWidth / metadata.originalHeight,
      width: metadata.originalHeight > 900 ? undefined : 'auto',
    },
    unoptimized: src.endsWith('.gif'),
    placeholder: 'blur',
    blurDataURL: metadata.dataURIBase64,
    width: metadata.originalWidth,
    height: metadata.originalWidth,
  }

  return <NextImage {...commonProps} />
}

export default MarkdownImage
