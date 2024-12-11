/* eslint-disable @stylistic/function-paren-newline */
'use client'

import { ColumnsPhotoAlbum } from 'react-photo-album'
import NextImage from 'next/image'
import 'react-photo-album/columns.css'
import {
  cloneElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'
import { getGalleryPhoto } from '@/plugins/remark/gallery-utils'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '@/components/Icons'
import { cn } from '@/utils/client'
import { makeBodyScroll, preventBodyScroll } from '@/store/ImageView'
import styles from './index.module.css'

const ThumbnailsHeight = 420

function ImageGallery(props: any) {
  const photos = getGalleryPhoto(props)
  const [slideNode, setSlideNode] = useState<ReactNode>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const currentIndex = useRef(0)
  const [thumbnailTranslateX, setThumbnailTranslateX] = useState(0)

  const hidden = useCallback(() => {
    setSlideNode(null)
  }, [])

  useEffect(() => {
    if (slideNode) {
      preventBodyScroll(hidden)
    } else {
      makeBodyScroll(hidden)
    }
    return () => {
      makeBodyScroll(hidden)
    }
  }, [slideNode])

  const allThumbnailsNode = useMemo(() => {
    return photos.map(({ src, width, height, base64 }, i) => {
      const commonProps = {
        alt: '',
        src,
        placeholder: 'blur',
        blurDataURL: base64,
      } as const
      return (
        <NextImage
          key={src}
          className={styles.w_full}
          width={(ThumbnailsHeight * width) / height}
          height={ThumbnailsHeight}
          onClick={() => {
            handleThumbnailClick(i)
          }}
          {...commonProps}
        />
      )
    })
  }, [])

  const nodesTranslateX = useMemo(() => {
    let left = 0
    const w = window.innerWidth / 2
    return allThumbnailsNode.map((node) => {
      console.log(node)
      const width = node.props.width / 7 + 12
      left += width
      return left - w
    })
  }, [])

  function handleThumbnailClick(index: number) {
    if (index < 0) {
      index = nodesTranslateX.length - 1
    } else if (index >= nodesTranslateX.length) {
      index = 0
    }
    setThumbnailTranslateX(nodesTranslateX[index])
    currentIndex.current = index
    const img = <img src={photos[index]['optimizeSrc']} />
    setSlideNode(img)
  }

  return (
    <div className={styles.gallery}>
      <ColumnsPhotoAlbum
        spacing={4}
        photos={photos}
        onClick={({ index }) => {
          handleThumbnailClick(index)
        }}
        render={{
          image(props, context) {
            const photo = photos[context.index]
            return (
              <Link
                href={photo.optimizeSrc}
                onClick={(e) => {
                  e.preventDefault()
                }}
              >
                {allThumbnailsNode[context.index]}
              </Link>
            )
          },
        }}
      />
      {slideNode && (
        <div className={styles.mask}>
          <div className={styles.close} onClick={hidden}>
            <CloseIcon />
          </div>
          <div className={styles.slide} ref={slideRef}>
            {slideNode}
          </div>
          <div
            className={styles.thumbnails}
            style={{
              transform: `translateX(${-thumbnailTranslateX}px)`,
            }}
          >
            {allThumbnailsNode.map((node, i) =>
              cloneElement(node, {
                key: node.key,
                className: cn({
                  [styles.active]: i === currentIndex.current,
                }),
              }),
            )}
          </div>
          <div
            onClick={() => handleThumbnailClick(currentIndex.current - 1)}
            className={cn(styles.arrow, styles.left_arrow)}
          >
            <ArrowLeftIcon />
          </div>
          <div
            onClick={() => handleThumbnailClick(currentIndex.current + 1)}
            className={cn(styles.arrow, styles.right_arrow)}
          >
            <ArrowRightIcon />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
