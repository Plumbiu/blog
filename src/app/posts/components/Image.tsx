'use client'

import NextImage from 'next/image'
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

  const commonProps = {
    ...rest,
    src,
    alt,
    style: {
      position: undefined,
    },
    onClick: clickHandler,
  }
  if (size) {
    node = <NextImage {...commonProps} width={size.w} height={size.h} />
  } else {
    node = <NextImage {...commonProps} fill />
  }

  function clickHandler(e: any) {
    e.stopPropagation()
    const imgNode = (
      <img
        onError={() => {
          setChildren(node)
        }}
        src={props.src}
      />
    )
    setChildren(imgNode)
  }
  return node
}

export default MarkdownImage
