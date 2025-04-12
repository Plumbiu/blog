'use client'

import React from 'react'
import { handleHTMLParserCodeKey } from '~/markdown/plugins/remark/html-parser-utils'
import { getReactComponentByEvalCode } from '../playground/compile'
import { customComponentMap } from '~/markdown/components/custom/custom-components'

const HtmlParser = React.memo((props: any) => {
  const component = React.useMemo(() => {
    const code = handleHTMLParserCodeKey(props)
    return getReactComponentByEvalCode(code, {
      React,
      ...customComponentMap,
    })
  }, [])
  if (!component) {
    return null
  }
  return React.createElement(component)
})

export default HtmlParser
