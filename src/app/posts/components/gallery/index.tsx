/* eslint-disable @stylistic/max-len */
'use client'

import { ColumnsPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/columns.css'
import { useState } from 'react'
import { Lightbox } from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import IntersectionObserverComponent from '@/components/IntersectionObserverComponent'
import styles from './index.module.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

export interface Gallery {
  width: number
  height: number
  src: string
  alt: string
}

interface ImageGalleryProps {
  images: Gallery[]
}

function ImageGallery(props: ImageGalleryProps) {
  const [index, setIndex] = useState(-1)
  return (
    <IntersectionObserverComponent className={styles.gallery}>
      {() => (
        <>
          <ColumnsPhotoAlbum
            spacing={4}
            photos={props.images}
            onClick={({ index }) => setIndex(index)}
          />
          <Lightbox
            slides={props.images}
            open={index >= 0}
            index={index}
            close={() => setIndex(-1)}
            // enable optional lightbox plugins
            plugins={[Thumbnails]}
          />
        </>
      )}
    </IntersectionObserverComponent>
  )
}

export default ImageGallery
