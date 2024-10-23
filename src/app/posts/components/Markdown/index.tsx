import { type Components } from 'hast-util-to-jsx-runtime'
import React, { isValidElement } from 'react'
import { getLangFromProps } from '@/plugins/remark/playground'
import { mono } from '@/app/fonts'
import Copy from '@/app/posts/components/Copy'
import MarkdownImage from '@/app/posts/components/Image'
import CustomComponent, { CustomComponentProp } from '@/app/posts/custom'
import { getComponentFromProps } from '@/plugins/constant'
import './index.css'

import transfromCode2Jsx from './transfrom'

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
  return <div className="md">{transfromCode2Jsx(content, components)}</div>
}

export default Markdown
