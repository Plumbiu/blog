import { type Components } from 'hast-util-to-jsx-runtime'
import { ImageProps } from 'next/image'
import MarkdownImage from '@/app/posts/components/Image'
import { handleComponentName } from '@/plugins/constant'
import {
  handleImagebase64,
  handleImageHeight,
  handleImageWidth,
} from '@/plugins/remark/image-utils'
import { optimizeCodeProps } from '@/plugins/remark/code-utils'
import { isUnOptimized } from '@/utils'
import CustomComponent from '~/data/components'
import PreComponent from '../components/Pre'

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
  img(props) {
    const { src, alt } = props
    const width = handleImageWidth(props)
    const height = handleImageHeight(props)
    const base64 = handleImagebase64(props)
    if (!src || !alt || !width || !height || !base64) {
      return null
    }
    const commonProps: ImageProps = {
      src,
      alt,
      unoptimized: isUnOptimized(src),
      blurDataURL: base64,
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
