import path from 'node:path'
import { type Components } from 'hast-util-to-jsx-runtime'
import { ImageProps } from 'next/image'
import { toString } from 'hast-util-to-string'
import MarkdownImage from '@/app/posts/components/Image'
import { handleComponentName } from '@/plugins/constant'
import { isUnOptimized, resolveAssetPath } from '@/utils'
import CustomComponent from '~/data/components'
import { getBlurDataUrl } from '@/utils/node/optimize'
import PreComponent from '../components/Pre'

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
    const code = props.node ? toString(props.node) : undefined
    return <PreComponent code={code}>{children}</PreComponent>
  },
  // @ts-ignore
  async img(props) {
    const { src, alt } = props
    if (!src || !alt) {
      return null
    }
    const imagePath = path.join('public', 'images', src)
    const { base64, metadata } = await getBlurDataUrl(imagePath)
    if (!base64 || !metadata) {
      return null
    }
    const commonProps: ImageProps = {
      src: resolveAssetPath(`images/${src}`),
      alt,
      unoptimized: isUnOptimized(src),
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
    return <CustomComponent {...rest} />
  },
}
