import { type ContainerDirective } from 'mdast-util-directive'

export interface Photo {
  width: number
  height: number
  src: string
  alt: string
  base64: string
  optimizeSrc: string
}

export interface PhotoNode {
  node: ContainerDirective
  links: string[]
}

export const GalleryPhotoKey = 'data-photos'
export const GalleryName = 'Gallery'

export function getGalleryPhoto(props: any): Photo[] {
  return JSON.parse(props[GalleryPhotoKey])
}
