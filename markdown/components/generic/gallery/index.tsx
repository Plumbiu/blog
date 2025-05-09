'use client'

import { ColumnsPhotoAlbum } from 'react-photo-album'
import NextImage from 'next/image'
import 'react-photo-album/columns.css'
import {
  type JSX,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getGalleryPhoto } from '~/markdown/plugins/remark/directive/gallery-utils'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '@/components/Icons'
import { cn } from '@/lib/client'
import { makeBodyScroll, avoidBodyScroll } from '@/store/utils'
import styles from './index.module.css'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { getBase64Url } from '@/lib/shared'

const ThumbnailsHeight = 360

type DragEvent = TouchEvent | MouseEvent

function ImageGallery(props: any) {
  const { photos = [], max } = getGalleryPhoto(props)
  const memoImageIndexSet = useRef<Set<number>>(new Set())
  const [slideNode, setSlideNode] = useState<ReactNode>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobileDevice()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [thumbnailTranslateX, setThumbnailTranslateX] = useState(0)
  const isMouseDown = useRef(false)
  const touchXRef = useRef({
    prev: 0,
    curr: 0,
  })

  const hidden = useCallback(() => {
    setSlideNode(null)
  }, [])

  const drageStart = useCallback((e: DragEvent) => {
    isMouseDown.current = true
    if ('touches' in e) {
      touchXRef.current.prev = e.touches[0].clientX
    } else if ('pageX' in e) {
      touchXRef.current.prev = e.pageX
    }
  }, [])

  const dragMove = useCallback((e: DragEvent) => {
    if ('touches' in e) {
      touchXRef.current.curr = e.touches[0].clientX
    } else if ('pageX' in e && isMouseDown.current) {
      touchXRef.current.curr = e.pageX
    }
  }, [])

  const dragEnd = useCallback(() => {
    const start = touchXRef.current.prev
    const end = touchXRef.current.curr
    if (end - start > 50) {
      handleThumbnailClick(currentIndex - 1)
    } else if (end - start < -50) {
      handleThumbnailClick(currentIndex + 1)
    }
    isMouseDown.current = false
  }, [currentIndex])

  useEffect(() => {
    if (!slideNode) {
      return
    }
    if (isMobile) {
      window.addEventListener('touchstart', drageStart)
      window.addEventListener('touchmove', dragMove)
      window.addEventListener('touchend', dragEnd)
      return () => {
        window.removeEventListener('touchstart', drageStart)
        window.removeEventListener('touchmove', dragMove)
        window.removeEventListener('touchend', dragEnd!)
      }
    }
  }, [slideNode])

  useEffect(() => {
    if (slideNode) {
      avoidBodyScroll(hidden)
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
    const children = thumbnailsRef.current!.children?.[currentIndex]
      .children[0] as HTMLImageElement
    if (children?.tagName === 'IMG') {
      const left = children.offsetLeft
      setThumbnailTranslateX(left)
    }
  }, [slideNode, currentIndex])

  const allThumbnailsNode = useMemo(() => {
    return photos.map(({ src, width, height, b64: base64 }, i) => {
      const commonProps = {
        alt: src,
        src,
        placeholder: 'blur',
        blurDataURL: getBase64Url(base64),
      } as const
      return (
        <NextImage
          key={i}
          className={styles.w_full}
          width={(ThumbnailsHeight * width) / height}
          height={ThumbnailsHeight}
          unoptimized={src.endsWith('.gif')}
          onClick={() => {
            handleThumbnailClick(i)
          }}
          {...commonProps}
        />
      )
    })
  }, [])

  function preloadImage(i: number) {
    if (memoImageIndexSet.current.has(i)) {
      return
    }
    const image = new Image()
    image.src = photos[i].ops
    memoImageIndexSet.current.add(i)
  }

  const thumbinalsLength = allThumbnailsNode.length

  const sildeNodes = useMemo(() => {
    return photos.map(({ ops: optimizeSrc, b64, width, height }, i) => {
      // preload images
      if (!max || i < max) {
        preloadImage(i)
      }
      return (
        <NextImage
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
    })
  }, [])

  function handleThumbnailClick(index: number) {
    if (index < 0) {
      index = thumbinalsLength - 1
    } else if (index >= thumbinalsLength) {
      index = 0
    }
    const start = index - 5
    const end = index + 5
    for (
      let i = start < 0 ? 0 : start;
      i < (end > photos.length ? photos.length : end);
      i++
    ) {
      preloadImage(i)
    }
    setCurrentIndex(index)
    setSlideNode(sildeNodes[index])
  }

  return (
    <div className={styles.gallery}>
      <ColumnsPhotoAlbum
        spacing={4}
        photos={max ? photos.slice(0, max) : photos}
        onClick={({ index }) => {
          handleThumbnailClick(index)
        }}
        render={{
          image(_props, context) {
            return allThumbnailsNode[context.index]
          },
        }}
      />
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
            {allThumbnailsNode.map((node, i) => (
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
