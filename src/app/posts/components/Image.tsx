'use client'

import NextImage, { type ImageProps } from 'next/image'
import useModalStore from '@/store/modal'

function MarkdownImage(props: ImageProps) {
  const set = useModalStore('set')
  const node = <NextImage {...props} onClick={() => set(node)} />

  return node
}

export default MarkdownImage
