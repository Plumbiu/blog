import path from 'node:path'
import { type Components } from 'hast-util-to-jsx-runtime'
import lqip from 'lqip-modern'
import React from 'react'
import { ImageProps } from 'next/image'
import { toString } from 'hast-util-to-string'
import MarkdownImage from '@/app/posts/components/Image'
import CustomComponent, { CustomComponentProp } from '@/components'
import { handleComponentName } from '@/plugins/constant'
import './index.css'
import transfromCode2Jsx from './transfrom'
import PreComponent from '../Pre'

const components: Partial<Components> = {
  pre(props) {
    const children = props.children
    const component = handleComponentName(props)
    if (component) {
      return (
        <CustomComponent
          {...props}
          defaultnode={<PreComponent>{children}</PreComponent>}
          component={component}
        />
      )
    }
    const code = props.node ? toString(props.node!) : undefined
    return <PreComponent code={code}>{children}</PreComponent>
  },
  // @ts-ignore
  async img(props) {
    const { node, src, alt, ...rest } = props
    if (!src || !alt) {
      return null
    }
    const imagePath = path.join('public', 'images', src)
    const { metadata } = await lqip(imagePath)
    const commonProps: ImageProps = {
      ...rest,
      src: `/images/${src}`,
      alt,
      style: {
        position: undefined,
        aspectRatio: metadata.originalWidth / metadata.originalHeight,
        width: metadata.originalHeight > 900 ? undefined : 'auto',
      },
      unoptimized: src.endsWith('.gif'),
      placeholder: 'blur',
      blurDataURL: metadata.dataURIBase64,
      width: metadata.originalWidth,
      height: metadata.originalWidth,
    }
    return <MarkdownImage {...commonProps} />
  },
  div(props) {
    const { children, node, ...rest } = props
    let component = handleComponentName(props)
    let defaultnode: any = <div {...rest}>{children}</div>
    const componentProps: CustomComponentProp = {
      ...rest,
      component,
      defaultnode,
      children,
    }
    return <CustomComponent {...componentProps} />
  },
}

function Markdown({ content }: { content: string }) {
  return <div className="md">{transfromCode2Jsx(content, components)}</div>
}

export default Markdown
