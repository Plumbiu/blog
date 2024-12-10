export const GalleryLinkKey = 'data-links'
export const GalleryName = 'Gallery'

export function getGalleryLinks(props: any) {
  return props[GalleryLinkKey]
}
