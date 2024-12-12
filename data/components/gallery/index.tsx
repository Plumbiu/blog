'use client'

import { ColumnsPhotoAlbum } from 'react-photo-album'
import NextImage from 'next/image'
import 'react-photo-album/columns.css'
import {
  cloneElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getGalleryPhoto } from '@/plugins/remark/gallery-utils'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '@/components/Icons'
import { cn } from '@/utils/client'
import { makeBodyScroll, preventBodyScroll } from '@/store/ImageView'
import styles from './index.module.css'

const ThumbnailsHeight = 360

function ImageGallery(props: any) {
  const photos = getGalleryPhoto(props)
  const [slideNode, setSlideNode] = useState<JSX.Element | null>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
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

  useEffect(() => {
    if (!slideNode) {
      return
    }
    const children = thumbnailsRef.current!?.children?.[
      currentIndex
    ] as HTMLImageElement
    if (children?.tagName === 'IMG') {
      const left = children.offsetLeft
      setThumbnailTranslateX(left)
    }
  }, [slideNode, currentIndex])

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
          key={i}
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

  const thumbinalsLength = allThumbnailsNode.length
  const sildeNodes = useMemo(() => {
    return photos.map(({ optimizeSrc }) => {
      return <img src={optimizeSrc} />
    })
  }, [])

  function handleThumbnailClick(index: number) {
    if (index < 0) {
      index = thumbinalsLength - 1
    } else if (index >= thumbinalsLength) {
      index = 0
    }
    setCurrentIndex(index)
    setSlideNode(sildeNodes[index])
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
              <a
                href={photo.optimizeSrc}
                onClick={(e) => {
                  e.preventDefault()
                }}
              >
                {allThumbnailsNode[context.index]}
              </a>
            )
          },
        }}
      />
      {slideNode && (
        <div className={styles.mask}>
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
            {allThumbnailsNode.map((node, i) => (
              <MemoThumbinalItem key={i} active={i === currentIndex}>
                {node}
              </MemoThumbinalItem>
            ))}
          </div>
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
    return cloneElement(children, {
      key: children.key,
      className: cn({
        [styles.active]: active,
      }),
    })
  },
)

export default ImageGallery
