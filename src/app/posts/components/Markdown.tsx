import React from 'react'
import './Markdown.css'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import { remarkContainerDirectivePlugin } from '@/plugins/rehype/container-directive'
import remarkPlayground, { getLangFromProps } from '@/plugins/remark/playground'
import { remarkSlug } from '@/plugins/remark/slug'
import rehypeElementPlugin from '@/plugins/rehype/element'
import rehypePrismGenerator from '@/plugins/rehype/hightlight'
import { BuildVisitor, visit } from 'unist-util-visit'
import { Components, toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { mono } from '@/app/fonts'
import Copy from '@/app/posts/components/Copy'
import MarkdownImage from '@/app/posts/components/Image'
import CustomComponent, { CustomComponentProp } from '@/app/posts/custom'
import { getComponentFromProps } from '@/plugins/constant'
import { isValidElement } from 'react'
import { getSingletonHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import getWasm from 'shiki/wasm'

const components: Partial<Components> = {
  pre(props) {
    const children = props.children
    const defaultnode = <pre className={mono.className}>{props.children}</pre>
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
}

function Markdown({ content }: { content: string }) {
  return <div className="md">{transfrom2Jsx(content)}</div>
}

export default Markdown

const shikiOptions = {
  themes: [
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
    import('shiki/langs/shell.mjs'),
    import('shiki/langs/bash.mjs'),
    import('shiki/langs/git-commit.mjs'),
    import('shiki/langs/git-rebase.mjs'),
    import('shiki/langs/regexp.mjs'),
  ],
}
async function transfrom2Jsx(code: string) {
  const shiki = await getSingletonHighlighterCore(shikiOptions)
  const processor = unified()
    .use(remarkParse)
    .use([
      remarkGfm,
      remarkDirective,
      remarkContainerDirectivePlugin,
      remarkSlug,
      remarkPlayground,
    ])
    .use(remarkRehype)
    .use([rehypeElementPlugin, rehypePrismGenerator(shiki)])
  const mdastTree = processor.parse(code)
  const hastTree = await processor.run(mdastTree)

  const transform: BuildVisitor<any> = (node, index, parent) => {
    if (node.type === 'raw' && parent && typeof index === 'number') {
      parent.children[index] = { type: 'text', value: node.value }
      return index
    }
  }
  visit(hastTree, transform)
  const node = toJsxRuntime(hastTree, {
    Fragment,
    components,
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
    passNode: true,
  })
  return node
}
