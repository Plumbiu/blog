import path from 'node:path'
import { type Components } from 'hast-util-to-jsx-runtime'
import lqip from 'lqip-modern'
import React, { isValidElement } from 'react'
import { ImageProps } from 'next/image'
import { mono } from '@/app/fonts'
import Copy from '@/app/posts/components/Copy'
import MarkdownImage from '@/app/posts/components/Image'
import CustomComponent, { CustomComponentProp } from '@/app/posts/custom'
import { getComponentFromProps, getLangFromProps } from '@/plugins/constant'
import './index.css'
import transfromCode2Jsx from './transfrom'

const langAlias: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
}
const DefaultLang = 'Txt'

const components: Partial<Components> = {
  pre(props) {
    const children = props.children
    const defaultnode = <pre className={mono.className}>{children}</pre>
    const component = getComponentFromProps(props)
    if (component) {
      return (
        <CustomComponent
          {...props}
          defaultnode={defaultnode}
          component={component}
        />
      )
    }
    if (isValidElement(children)) {
      const code = children.props.children
      let lang = getLangFromProps(children.props)
      if (!lang) {
        lang = DefaultLang
      } else {
        const key = lang.replace('diff-', '')
        lang = langAlias[key] || key
      }
      return (
        <div className="pre-wrap">
          <div className="pre-bar">
            {lang}
            <Copy text={code} />
          </div>
          {defaultnode}
        </div>
      )
    }

    return defaultnode
  },
  // @ts-ignore
  async img(props) {
    const { node, src, alt, ...rest } = props
    if (!src || !alt) {
      return null
    }
    const imagePath = path.join('public', src)
    const { metadata } = await lqip(imagePath)
    const commonProps: ImageProps = {
      ...rest,
      src,
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
    let component = getComponentFromProps(props)
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
