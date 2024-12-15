'use client'

import NextImage, { type ImageProps } from 'next/image'
import useImageViewlStore from '@/store/ImageView'

function MarkdownImage(props: ImageProps) {
  const set = useImageViewlStore('set')
  const node = <NextImage {...props} onClick={() => set(node)} />

  return node
}

export default MarkdownImage
