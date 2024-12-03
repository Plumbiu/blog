import path from 'node:path'
import { type Components } from 'hast-util-to-jsx-runtime'
import { ImageProps } from 'next/image'
import { toString } from 'hast-util-to-string'
import MarkdownImage from '@/app/posts/_components/Image'
import CustomComponent from '@/components'
import './index.css'
import './shiki.css'
import { handleComponentName } from '@/app/posts/_plugins/constant'
import { getBlurDataUrl } from '@/utils/node'
import { resolveAssetPath } from '@/utils'
import transfromCode2Jsx from './transfrom'
import PreComponent from '../Pre'

const components: Partial<Components> = {
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
    const imagePath = path.join('public', 'images', src)
    const { base64, metadata } = await getBlurDataUrl(imagePath)
    if (!base64 || !metadata) {
      return null
    }
    const commonProps: ImageProps = {
      src: resolveAssetPath(`images/${src}`),
      alt,
      unoptimized: src.endsWith('.gif') ? true : undefined,
      blurDataURL: base64,
      placeholder: 'blur',
      width: metadata.width,
      height: metadata.height,
    }
    return <MarkdownImage {...commonProps} />
  },
  div(props) {
    const { node, ...rest } = props
    return <CustomComponent {...rest} />
  },
}

function Markdown({ content }: { content: string }) {
  return <div className="md">{transfromCode2Jsx(content, components)}</div>
}

export default Markdown
