import ReactMarkdown from 'react-markdown'
import React, { isValidElement, ReactNode } from 'react'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import Copy from '../components/Copy'
import CustomComponent, { CustomComponentProp } from '../custom'
import './Markdown.css'
import MarkdownImage from './Image'
import {
  BashIcon,
  JavaScriptIcon,
  JsonIcon,
  JsxIcon,
  ReactIcon,
  RustIcon,
  ShellIcon,
  TsxIcon,
  TypeScriptIcon,
  VueIcon,
} from '@/components/Icons'
import { mono } from '@/app/fonts'
import { getComponentFromProps } from '@/plugins/constant'
import { remarkContainerDirectivePlugin } from '@/plugins/rehype/container-directive'
import remarkPlayground, { getLangFromProps } from '@/plugins/remark/playground'
import { remarkSlug } from '@/plugins/remark/slug'
import rehypeElementPlugin from '@/plugins/rehype/element'
import rehypePrismGenerator from '@/plugins/rehype/hightlight'
import { getShiki } from '@/shiki'

const iconMap: Record<string, ReactNode> = {
  javascript: <JavaScriptIcon />,
  typescript: <TypeScriptIcon />,
  rust: <RustIcon />,
  react: <ReactIcon />,
  jsx: <JsxIcon />,
  tsx: <TsxIcon />,
  vue: <VueIcon />,
  json: <JsonIcon />,
  shell: <ShellIcon />,
  bash: <BashIcon />,
}

async function Markdown({ content }: { content: string }) {
  const shiki = await getShiki()
  return (
    <ReactMarkdown
      className="md"
      remarkPlugins={[
        remarkGfm,
        remarkDirective,
        remarkContainerDirectivePlugin,
        remarkSlug,
        remarkPlayground,
      ]}
      rehypePlugins={[rehypeElementPlugin, rehypePrismGenerator(shiki)]}
      components={{
        pre(props) {
          const children = props.children
          const defaultnode = (
            <pre className={mono.className}>{props.children}</pre>
          )
          if (isValidElement(children)) {
            const code = children.props.children
            const lang = getLangFromProps(children.props)
            return (
              <div className="pre-wrap">
                <div className="pre-bar">
                  <div className="pre-lang">{lang}</div>
                  <Copy text={code} />
                </div>
                {defaultnode}
              </div>
            )
          }
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
          return defaultnode
        },
        img(props) {
          const { node, ...rest } = props
          return <MarkdownImage {...rest} />
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
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default Markdown
