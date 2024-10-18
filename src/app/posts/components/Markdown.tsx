/* eslint-disable @stylistic/max-len */
import ReactMarkdown from 'react-markdown'
import React, { isValidElement, ReactNode } from 'react'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import { createHighlighterCore, HighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import getWasm from 'shiki/wasm'
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
import { isPromise } from '@/utils'

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

type Highlighter = Promise<HighlighterCore> | HighlighterCore | null

class ShikiOperation {
  static highlighter: Highlighter = null

  static async init() {
    const shiki = this.highlighter
    const isShikiPromise = isPromise<Highlighter>(shiki)
    if (shiki !== null && !isShikiPromise) {
      return shiki
    }
    this.highlighter = await createHighlighterCore({
      themes: [
        // 传入导入的包，而不是字符串
        // 如果你需要进行块分割（chunk splitting），请使用动态导入
        import('shiki/themes/vitesse-dark.mjs'),
        import('shiki/themes/vitesse-light.mjs'),
      ],
      engine: createOnigurumaEngine(getWasm),
      langs: [
        import('shiki/langs/js.mjs'),
        import('shiki/langs/jsx.mjs'),
        import('shiki/langs/tsx.mjs'),
        import('shiki/langs/ts.mjs'),
        import('shiki/langs/css.mjs'),
        import('shiki/langs/rust.mjs'),
        import('shiki/langs/vue.mjs'),
        import('shiki/langs/json.mjs'),
        import('shiki/langs/json5.mjs'),
        import('shiki/langs/yaml.mjs'),
        import('shiki/langs/go.mjs'),
        import('shiki/langs/html.mjs'),
        import('shiki/langs/html-derivative.mjs'),
        import('shiki/langs/vue-html.mjs'),
        import('shiki/langs/markdown.mjs'),
        import('shiki/langs/xml.mjs'),
        import('shiki/langs/regex.mjs'),
        import('shiki/langs/less.mjs'),
        import('shiki/langs/c.mjs'),
        import('shiki/langs/cpp.mjs'),
        import('shiki/langs/cmake.mjs'),
        import('shiki/langs/csharp.mjs'),
        import('shiki/langs/cs.mjs'),
        import('shiki/langs/docker.mjs'),
        import('shiki/langs/shell.mjs'),
        import('shiki/langs/bash.mjs'),
        import('shiki/langs/git-commit.mjs'),
        import('shiki/langs/git-rebase.mjs'),
      ],
    })
    return this.highlighter
  }

  static async getShiki() {
    let shiki = this.highlighter
    if (shiki === null) {
      shiki = await this.init()
    } else if (isPromise(shiki)) {
      shiki = await shiki
    }
    return shiki
  }
}

async function Markdown({ content }: { content: string }) {
  const highlighter = await ShikiOperation.getShiki()
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
      rehypePlugins={[
        rehypeElementPlugin,
        rehypePrismGenerator(highlighter),
        // [rehypePrism, { ignoreMissing: true }],
      ]}
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
