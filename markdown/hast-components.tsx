import type { Components } from 'hast-util-to-jsx-runtime'
import type { ImageProps } from 'next/image'
import MarkdownImage from '@/app/posts/[...slug]/components/Image'
import {
  handleComponentName,
  handleComponentProps,
} from '~/markdown/plugins/constant'
import { isUnOptimized, resolveAssetPath } from '@/lib/shared'
import CustomComponent from '~/markdown/components/index'
import PreComponent from '../src/components/ui/Pre'
import { getAssetImagePath } from '@/lib/node/fs'
import getBlurDataUrl from '~/optimize/blurhash'
import { getBase64Url } from '@/lib/shared'
import { optimizeProps } from './plugins/props-optimize'

export const markdownComponents: Partial<Components> = {
  pre(props) {
    const { node, ...rest } = props
    const component = handleComponentName(props)
    const children = props.children
    optimizeProps(rest)
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
      src: resolveAssetPath(`images${src[0] === '/' ? src : `/${src}`}`),
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
    const customComponentProps = handleComponentProps(rest)
    const componentProps = {
      ...rest,
      ...(customComponentProps ?? {}),
    }
    optimizeProps(componentProps)
    return <CustomComponent {...componentProps} />
  },
}
