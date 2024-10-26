'use client'

import NextImage, { ImageProps } from 'next/image'
import { ReactNode } from 'react'
import useModalStore from '@/store/modal'
import imageinfo from '@/image-info.json'

interface IImage {
  src?: string
  alt?: string
  [key: string]: any
}

function MarkdownImage(props: IImage) {
  const { src, alt, ...rest } = props
  if (!src || !alt) {
    return null
  }
  const size = (imageinfo as any)[src]
  const setChildren = useModalStore('setChildren')
  let node: ReactNode = null

  const commonProps: ImageProps = {
    ...rest,
    src,
    alt,
    style: {
      position: undefined,
    },
    onClick: clickHandler,
    unoptimized: src.endsWith('.gif'),
  }
  if (size) {
    commonProps.style!.aspectRatio = size.w / size.h
    node = <NextImage {...commonProps} width={size.w} height={size.h} />
  } else {
    node = <NextImage {...commonProps} fill />
  }

  function clickHandler(e: any) {
    e.stopPropagation()
    setChildren(node)
  }
  return node
}

export default MarkdownImage
