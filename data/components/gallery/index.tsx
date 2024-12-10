/* eslint-disable @stylistic/max-len */
'use client'

import { ColumnsPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/columns.css'
import { useState } from 'react'
import { Lightbox } from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import IntersectionObserverComponent from '@/components/IntersectionObserverComponent'
import { getGalleryPhoto } from '@/plugins/remark/gallery-utils'
import styles from './index.module.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

function ImageGallery(props: any) {
  const pothos = getGalleryPhoto(props)
  const [index, setIndex] = useState(-1)
  return (
    <IntersectionObserverComponent className={styles.gallery}>
      {() => (
        <>
          <ColumnsPhotoAlbum
            spacing={4}
            photos={pothos}
            onClick={({ index }) => setIndex(index)}
          />
          <Lightbox
            slides={pothos}
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
