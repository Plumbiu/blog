'use client'

import { ColumnsPhotoAlbum } from 'react-photo-album'
import NextImage, { getImageProps } from 'next/image'
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
import { makeBodyScroll, preventBodyScroll } from '@/store/ImageView'
import styles from './index.module.css'

const ThumbnailsHeight = 400

function ImageGallery(props: any) {
  const pothos = getGalleryPhoto(props)
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
      preventBodyScroll(hidden)
    }
  }, [slideNode])

  const allThumbnailsNode = useMemo(() => {
    return pothos.map(({ src, width, height, base64 }, i) => {
      const commonProps = {
        alt: '',
        src,
        placeholder: 'blur',
        blurDataURL: base64,
      } as const
      const { props } = getImageProps({
        ...commonProps,
        width,
        height,
        unoptimized: isUnOptimized(src),
      })
      return (
        <NextImage
          data-src={props.src}
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
    return allThumbnailsNode.map((node, i) => {
      const width = node.props.width / 5 + 12
      left += width
      return left - window.innerWidth / 2
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
    const node = allThumbnailsNode[index]
    setSlideNode(<img src={node.props['data-src']} />)
  }

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
          <div
            className={styles.thumbnails}
            style={{
              transform: `translateX(${-thumbnailTranslateX}px)`,
            }}
          >
            {allThumbnailsNode}
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
