'use client'

import NextImage, { ImageProps } from 'next/image'
import { ReactNode } from 'react'
import useModalStore from '@/store/modal'
import imageinfo from '@/image-info.json'
import { getPathInfo } from '@/utils'

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
  const { dirname, basename } = getPathInfo(src)
  const size = (imageinfo as any)[basename]

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
    placeholder: 'blur',
    blurDataURL: `${dirname}/blur${src[0] === '/' ? src : '/' + src}`,
  }
  if (size) {
    const [w, h] = size
    commonProps.style!.aspectRatio = w / h
    node = <NextImage {...commonProps} width={w} height={h} />
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
