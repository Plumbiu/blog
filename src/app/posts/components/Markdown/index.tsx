import path from 'node:path'
import { type Components } from 'hast-util-to-jsx-runtime'
import lqip from 'lqip-modern'
import React from 'react'
import { ImageProps } from 'next/image'
import { toString } from 'hast-util-to-string'
import MarkdownImage from '@/app/posts/components/Image'
import CustomComponent from '@/components'
import './index.css'
import transfromCode2Jsx from './transfrom'
import PreComponent from '../Pre'

const components: Partial<Components> = {
  pre(props) {
    const code = props.node ? toString(props.node!) : undefined
    const defaultnode = (
      <PreComponent code={code}>{props.children}</PreComponent>
    )
    return <CustomComponent {...props} defaultnode={defaultnode} />
  },
  // @ts-ignore
  async img(props) {
    const { src, alt } = props
    if (!src || !alt) {
      return null
    }
    const imagePath = path.join('public', 'images', src)
    const { metadata } = await lqip(imagePath)
    const commonProps: ImageProps = {
      src: `/images/${src}`,
      alt,
      unoptimized: src.endsWith('.gif'),
      placeholder: 'blur',
      blurDataURL: metadata.dataURIBase64,
      width: metadata.originalWidth,
      height: metadata.originalWidth,
    }
    return <MarkdownImage {...commonProps} />
  },
  div(props) {
    const defaultnode = <div>{props.children}</div>
    return <CustomComponent {...props} defaultnode={defaultnode} />
  },
}

function Markdown({ content }: { content: string }) {
  return <div className="md">{transfromCode2Jsx(content, components)}</div>
}

export default Markdown
