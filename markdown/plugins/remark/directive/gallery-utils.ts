import type { ContainerDirective } from 'mdast-util-directive'

export interface Photo {
  // width
  width: number
  // height
  height: number
  src: string
  alt: string
  // base64
  b64: string
  // optimzed src
  ops: string
}

export interface PhotoNode {
  node: ContainerDirective
  links: string[]
  maxNum: number | undefined
}

export const GalleryPhotoKey = 'gallery-photo'
export const GalleryName = 'Gallery'
export const GalleryPhotoConfigKey = 'gallery-config'

export function getGalleryPhoto(props: any): {
  photos: Photo[]
  max: number | undefined
} {
  const data = props[GalleryPhotoKey]
  return data
    ? JSON.parse(data)
    : {
        photos: [],
        max: undefined,
      }
}

export function getGalleryPhotoConfig(props: any): PhotoNode[] {
  return JSON.parse(props[GalleryPhotoConfigKey])
}
