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
import { getShiki } from '@/utils/node/shiki'
import { urlAttributes } from 'html-url-attributes'
import { BuildVisitor, visit } from 'unist-util-visit'
import { Components, toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { mono } from '@/app/fonts'
import Copy from '@/app/posts/components/Copy'
import MarkdownImage from '@/app/posts/components/Image'
import CustomComponent, { CustomComponentProp } from '@/app/posts/custom'
import { getComponentFromProps } from '@/plugins/constant'
import { isValidElement } from 'react'

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

const safeProtocol = /^(https?|ircs?|mailto|xmpp)$/i
export async function transfrom2Jsx(code: string) {
  const shiki = await getShiki()
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

    if (node.type === 'element') {
      /** @type {string} */
      let key: string

      for (key in urlAttributes) {
        if (
          Object.hasOwn(urlAttributes, key) &&
          Object.hasOwn(node.properties, key)
        ) {
          const value = node.properties[key]
          const test = urlAttributes[key]
          if (test === null || test.includes(node.tagName)) {
            node.properties[key] = urlTransform(String(value || ''))
          }
        }
      }
    }
  }
  visit(hastTree, transform)

  return toJsxRuntime(hastTree, {
    Fragment,
    components,
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
    passNode: true,
  })
}

function urlTransform(value: string) {
  // Same as:
  // <https://github.com/micromark/micromark/blob/929275e/packages/micromark-util-sanitize-uri/dev/index.js#L34>
  // But without the `encode` part.
  const colon = value.indexOf(':')
  const questionMark = value.indexOf('?')
  const numberSign = value.indexOf('#')
  const slash = value.indexOf('/')

  if (
    // If there is no protocol, it’s relative.
    colon < 0 ||
    // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    (slash > -1 && colon > slash) ||
    (questionMark > -1 && colon > questionMark) ||
    (numberSign > -1 && colon > numberSign) ||
    // It is a protocol, it should be allowed.
    safeProtocol.test(value.slice(0, colon))
  ) {
    return value
  }

  return ''
}
