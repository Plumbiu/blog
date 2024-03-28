'use client'
import Image from 'next/image'
import { Photo, PhotoAlbum, type RenderPhotoProps } from 'react-photo-album'

function NextJsImage({
  photo,
  imageProps: { alt, title, sizes, className, onClick },
  wrapperStyle,
}: RenderPhotoProps) {
  return (
    <div style={{ ...wrapperStyle, position: 'relative' }}>
      <Image
        fill
        src={photo}
        placeholder={'blurDataURL' in photo ? 'blur' : undefined}
        {...{ alt, title, sizes, className, onClick }}
      />
    </div>
  )
}

export default function Gallery(props: { photos: Photo[] }) {
  return (
    <PhotoAlbum
      layout="rows"
      photos={props.photos}
      renderPhoto={NextJsImage}
      defaultContainerWidth={1200}
      sizes={{ size: 'calc(100vw - 240px)' }}
    />
  )
}
