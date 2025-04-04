import type { Components } from 'hast-util-to-jsx-runtime'
import type { ImageProps } from 'next/image'
import MarkdownImage from '@/app/posts/components/Image'
import { handleComponentName } from '@/plugins/constant'
import { optimizeCodeProps } from '@/plugins/remark/code-utils'
import { isUnOptimized, resolveAssetPath } from '@/utils'
import CustomComponent from '~/data/components'
import PreComponent from '../components/Pre'
import { getAssetImagePath } from '@/utils/node/fs'
import { getBlurDataUrl } from '@/utils/node/optimize'
import { getBase64Url } from '@/utils/client'

export const markdownComponents: Partial<Components> = {
  pre(props) {
    const { node, ...rest } = props
    const component = handleComponentName(props)
    const children = props.children
    optimizeCodeProps(rest)
    if (component) {
      return <CustomComponent {...rest} />
    }
    return <PreComponent>{children}</PreComponent>
  },
  async img(props) {
    const { src, alt } = props
    if (!src || !alt) {
      return
    }
    if (src.endsWith('.mp4')) {
      return <video muted src={src} controls />
    }
    const imagePath = getAssetImagePath(src)
    const { base64, metadata } = await getBlurDataUrl(
      decodeURIComponent(imagePath),
    )
    const { width, height } = metadata ?? {}
    if (!width || !height || !base64) {
      return
    }
    const commonProps: ImageProps = {
      src: resolveAssetPath(`images/${src}`),
      alt,
      unoptimized: isUnOptimized(src),
      blurDataURL: getBase64Url(base64),
      placeholder: 'blur',
      width,
      height,
    }
    return <MarkdownImage {...commonProps} />
  },
  div(props) {
    const { node, ...rest } = props
    return <CustomComponent {...rest} />
  },
}
