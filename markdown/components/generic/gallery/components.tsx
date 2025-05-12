import { getBase64Url } from '@/lib/shared'
import NextImage from 'next/image'
import type { ImageProps } from 'next/image'
import { memo } from 'react'

export const MemoNextImage = memo(
  ({
    src,
    width,
    height,
    onClick,
    b64,
    alt,
    ...rest
  }: ImageProps & {
    b64: string
  }) => {
    const srcString = src as string
    return (
      <NextImage
        unoptimized={srcString.endsWith('.gif')}
        onClick={onClick}
        width={width}
        height={height}
        src={src}
        alt={alt}
        placeholder="blur"
        blurDataURL={getBase64Url(b64)}
        {...rest}
      />
    )
  },
)
