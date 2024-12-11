'use client'

import { ColumnsPhotoAlbum } from 'react-photo-album'
import { getImageProps } from 'next/image'
import 'react-photo-album/columns.css'
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getGalleryPhoto } from '@/plugins/remark/gallery-utils'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '@/components/Icons'
import { cn } from '@/utils/client'
import { isUnOptimized } from '@/utils'
import styles from './index.module.css'

const ThumbnailsWidth = 80

function ImageGallery(props: any) {
  const pothos = getGalleryPhoto(props)
  const [slideNode, setSlideNode] = useState<ReactNode>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const [thumbnailStart, setThumbnailStart] = useState(0)
  const slideImage = useRef<ReactNode[]>([])
  const hidden = useCallback(() => {
    setSlideNode(null)
  }, [])

  useEffect(() => {
    return () => {
      window.removeEventListener('popstate', hidden)
    }
  }, [])

  const allThumbnailsNode = useMemo(() => {
    return pothos.map(({ src, width, height }, i) => {
      const { props: minProps } = getImageProps({
        src,
        alt: '',
        width: (ThumbnailsWidth * width) / height,
        height: ThumbnailsWidth,
      })
      const { props: bigProps } = getImageProps({
        src,
        alt: '',
        width,
        height,
        unoptimized: isUnOptimized(src),
      })
      const bigNode = <img src={bigProps.src} />
      slideImage.current.push(bigNode)
      return (
        <img
          key={src}
          width="100%"
          onClick={() => {
            handleThumbnailClick(i)
            setSlideNode(bigNode)
          }}
          src={minProps.src}
        />
      )
    })
  }, [])

  function handleThumbnailClick(index: number) {
    const slideDom = slideRef.current
    const data = index > thumbnailStart ? 'right' : 'left'

    if (slideDom && index !== thumbnailStart) {
      slideDom.setAttribute('data-move', data)
    }
    if (index < 0) {
      index = pothos.length - 1
    }
    if (index > pothos.length - 1) {
      index = 0
    }
    setSlideNode(slideImage.current[index])
    setThumbnailStart(index)
  }
  const thumbnailsLength = allThumbnailsNode.length
  const thumbnails = useMemo(() => {
    const start = thumbnailStart - 2
    const end = thumbnailStart + 3
    if (start <= 0) {
      return [
        ...allThumbnailsNode.slice(thumbnailsLength + start, thumbnailsLength),
        ...allThumbnailsNode.slice(0, 5 + start),
      ]
    }
    if (start >= thumbnailsLength - 4) {
      return [
        ...allThumbnailsNode.slice(start, thumbnailsLength),
        ...allThumbnailsNode.slice(0, end - thumbnailsLength),
      ]
    }
    return allThumbnailsNode.slice(start, end)
  }, [thumbnailStart])
  return (
    <div className={styles.gallery}>
      <ColumnsPhotoAlbum
        spacing={4}
        photos={pothos}
        onClick={({ index }) => {
          handleThumbnailClick(index)
        }}
        render={{
          image(props, context) {
            return allThumbnailsNode[context.index]
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
          <div className={styles.thumbnails}>{thumbnails}</div>
          <div
            onClick={() => handleThumbnailClick(thumbnailStart - 1)}
            className={cn(styles.arrow, styles.left_arrow)}
          >
            <ArrowLeftIcon />
          </div>
          <div
            onClick={() => handleThumbnailClick(thumbnailStart + 1)}
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
