import { Gallery } from '@/app/posts/types'
export const GalleryPhotoKey = 'data-photos'
export const GalleryName = 'Gallery'

export function getGalleryPhoto(props: any): Gallery[] {
  return JSON.parse(props[GalleryPhotoKey])
}
