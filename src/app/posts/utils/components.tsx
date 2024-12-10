import path from 'node:path'
import { type Components } from 'hast-util-to-jsx-runtime'
import { ImageProps } from 'next/image'
import { toString } from 'hast-util-to-string'
import MarkdownImage from '@/app/posts/components/Image'
import { handleComponentName } from '@/plugins/constant'
import { resolveAssetPath } from '@/utils'
import CustomComponent from '~/data/components'
import { getBlurDataUrl } from '@/utils/node/optimize'
import { getGalleryLinks } from '@/plugins/remark/gallery-utils'
import { isString } from '@/utils/types'
import PreComponent from '../components/Pre'
import ImageGallery, { Gallery } from '../components/gallery'

export const markdownComponents: Partial<Components> = {
  pre(props) {
    const { node, ...rest } = props
    const component = handleComponentName(props)
    const children = props.children
    // reduce bundle size, {...props} is too large, if it's not CustromComponent
    // the pre element will contain too many information
    if (component) {
      return <CustomComponent {...rest} />
    }
    const code = props.node ? toString(props.node).trim() : undefined
    return <PreComponent code={code}>{children}</PreComponent>
  },
  // @ts-ignore
  async img(props) {
    const { src, alt } = props
    if (!src || !alt) {
      return null
    }
    console.log(src)
    const imagePath = path.join('public', 'images', src)
    const { base64, metadata } = await getBlurDataUrl(imagePath)
    if (!base64 || !metadata) {
      return null
    }
    const commonProps: ImageProps = {
      src: resolveAssetPath(`images/${src}`),
      alt,
      unoptimized:
        src.endsWith('.gif') || src.endsWith('.webp') ? true : undefined,
      blurDataURL: base64,
      placeholder: 'blur',
      width: metadata.width,
      height: metadata.height,
    }
    return <MarkdownImage {...commonProps} />
  },
  // @ts-ignore
  async div(props) {
    const { node, ...rest } = props
    const component = handleComponentName(props)
    if (node && component === 'Gallery') {
      const rawLinks = getGalleryLinks(node.properties)
      if (isString(rawLinks)) {
        const links = rawLinks.split(/\r?\n/)
        const images: Gallery[] = []

        await Promise.all(
          links.map(async (link, i) => {
            const imagePath = path.join('public', 'images', link)
            const { base64, metadata } = await getBlurDataUrl(imagePath)
            if (!base64 || !metadata.width || !metadata.height) {
              return null
            }
            const alt = node.properties.alt
            images.push({
              width: metadata.width,
              height: metadata.height,
              src: resolveAssetPath(`images/${link}`),
              alt: alt ? String(alt) : `img-${i}`,
            })
          }),
        )
        return <ImageGallery images={images.filter(Boolean)} />
      }
    }
    return <CustomComponent {...rest} />
  },
}
