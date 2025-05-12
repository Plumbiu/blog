// This component based on: https://github.com/igordanchenko/react-photo-album
// LICENSE: https://github.com/igordanchenko/react-photo-album/blob/main/LICENSE
'use client'

import NextImage from 'next/image'
import {
  type JSX,
  memo,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getGalleryPhoto } from '~/markdown/plugins/remark/directive/gallery-utils'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '@/components/Icons'
import { cn } from '@/lib/client'
import styles from './index.module.css'
import { getBase64Url } from '@/lib/shared'
import {
  useBodyScrollEvent,
  useColumnPhoto,
  useMobileDiviceEvent,
} from './hooks'

const ThumbnailsHeight = 360

function ImageGallery(props: any) {
  const { photos = [], max } = getGalleryPhoto(props)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [slideNode, setSlideNode] = useState<ReactNode>(null)
  const columnPhotos = useColumnPhoto({
    photos,
    ref: galleryRef,
    max,
  })
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [thumbnailTranslateX, setThumbnailTranslateX] = useState(0)
  useMobileDiviceEvent({
    handleThumbnailClick,
    currentIndex,
  })
  useBodyScrollEvent({
    hidden,
    slideNode,
  })

  function hidden() {
    setSlideNode(null)
  }

  function getActiveNode() {
    const { ops: optimizeSrc, b64, width, height } = photos[currentIndex]
    return (
      <NextImage
        data-no-view
        width={width}
        height={height}
        style={{
          objectFit: 'contain',
        }}
        unoptimized
        blurDataURL={getBase64Url(b64)}
        placeholder="blur"
        key={optimizeSrc}
        src={optimizeSrc}
        alt={optimizeSrc}
      />
    )
  }

  function handleThumbnailClick(index: number) {
    const len = photos.length
    if (index < 0) {
      index = len - 1
    } else if (index >= len) {
      index = 0
    }
    setCurrentIndex(index)
    setSlideNode(getActiveNode())
  }

  useEffect(() => {
    if (!slideNode) {
      return
    }
    const children = thumbnailsRef.current!.children?.[currentIndex]
      .children[0] as HTMLImageElement
    if (children?.tagName === 'IMG') {
      const left = children.offsetLeft
      setThumbnailTranslateX(left)
    }
  }, [slideNode, currentIndex])

  const [slideNodes, columnNodes] = useMemo(() => {
    const slideNodes = photos.map(({ src, b64, ops, width, height }, index) => (
      <NextImage
        key={src}
        data-no-view
        unoptimized
        onClick={() => {
          handleThumbnailClick(index)
        }}
        width={(ThumbnailsHeight * width) / height}
        height={ThumbnailsHeight}
        src={ops}
        alt={src}
        placeholder="blur"
        blurDataURL={getBase64Url(b64)}
      />
    ))
    const columnNodes = columnPhotos.map((items, i) => {
      return (
        <div key={i}>
          {items.map(({ photo, height, width, index }) => (
            <NextImage
              key={photo.src}
              unoptimized={photo.src.endsWith('.gif')}
              onClick={() => {
                handleThumbnailClick(index)
              }}
              width={width}
              height={height}
              src={photo.src}
              alt={photo.src}
              placeholder="blur"
              blurDataURL={getBase64Url(photo.b64)}
            />
          ))}
        </div>
      )
    })
    return [slideNodes, columnNodes]
  }, [columnPhotos])

  return (
    <div ref={galleryRef} className={styles.gallery}>
      <div className={styles.imgs}>{columnNodes}</div>
      {max ? (
        <div className={styles.seemore}>
          剩余隐藏{photos.length - max}张图片....
        </div>
      ) : null}
      {slideNode && (
        <div className={cn('fcc', styles.mask)}>
          <div className={styles.close} onClick={hidden}>
            <CloseIcon />
          </div>
          <div className={styles.slide}>{slideNode}</div>
          <div
            className={styles.thumbnails}
            style={{
              transform: `translateX(${
                -thumbnailTranslateX + window.innerWidth / 2
              }px)`,
            }}
            ref={thumbnailsRef}
          >
            {slideNodes.map((node, i) => (
              <MemoThumbinalItem key={i} active={i === currentIndex}>
                {node}
              </MemoThumbinalItem>
            ))}
          </div>
          <div className={styles.thumbnils_bg} />
          <ArrowLeftIcon
            onClick={() => handleThumbnailClick(currentIndex - 1)}
            className={cn(styles.arrow, styles.left_arrow)}
          />
          <ArrowRightIcon
            onClick={() => handleThumbnailClick(currentIndex + 1)}
            className={cn(styles.arrow, styles.right_arrow)}
          />
        </div>
      )}
    </div>
  )
}

const MemoThumbinalItem = memo(
  ({ children, active }: { children: JSX.Element; active: boolean }) => {
    return (
      <div
        className={cn({
          [styles.active]: active,
        })}
      >
        {children}
      </div>
    )
  },
)

export default ImageGallery
