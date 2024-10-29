'use client'

import NextImage, { ImageProps } from 'next/image'
import useModalStore from '@/store/modal'

function MarkdownImage(props: ImageProps) {
  const setChildren = useModalStore('setChildren')

  const node = (
    <NextImage
      {...props}
      onClick={() => {
        setChildren(node)
      }}
    />
  )

  return node
}

export default MarkdownImage
