import type { Root } from 'hast'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { getSingletonHighlighterCore } from 'shiki/core'
import { shikiClassTransformer } from 'shiki-class-transformer'
import {
  transformerNotationWordHighlight,
  transformerNotationHighlight,
  transformerNotationDiff,
} from '@shikijs/transformers'
import shikiMap from 'shiki-class-transformer/themes/github-light.json'
import vitesseDark from 'shiki/themes/github-dark.mjs'
import vitesseLight from 'shiki/themes/github-light.mjs'
import { customShikiTranformer } from './transformer'
import {
  getLanguage,
  HighLightWordClassName,
  HighLightLineClassName,
  DiffInsertedClassName,
  DiffDeletedClassName,
} from './highlight-utils'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const shikiOptions = {
  themes: [vitesseDark, vitesseLight],
  engine: createJavaScriptRegexEngine(),
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
    import('shiki/langs/xml.mjs'),
    import('shiki/langs/regex.mjs'),
    import('shiki/langs/less.mjs'),
    import('shiki/langs/shell.mjs'),
    import('shiki/langs/bash.mjs'),
    import('shiki/langs/git-commit.mjs'),
    import('shiki/langs/git-rebase.mjs'),
    import('shiki/langs/regexp.mjs'),
    import('shiki/langs/markdown.mjs'),
    import('shiki/langs/markdown-vue.mjs'),
    import('shiki/langs/c.mjs'),
    import('shiki/langs/cpp.mjs'),
  ],
}

const themeOptions = {
  light: 'github-light',
  dark: 'github-dark',
}
// This code is modified based on
// https://github.com/timlrx/rehype-prism-plus/blob/main/src/generator.js
// LICENSE: https://github.com/timlrx/rehype-prism-plus/blob/main/LICENSE
const rehypeShikiPlugin = () => {
  return async (tree: Root) => {
    const shiki = await getSingletonHighlighterCore(shikiOptions)
    visit(tree, 'element', (node, _index, parent) => {
      if (
        !parent ||
        parent.type !== 'element' ||
        parent.tagName !== 'pre' ||
        node.tagName !== 'code'
      ) {
        return
      }
      const props = node.properties
      const data = node.data
      const code = toString(node).trim()
      const meta = (data?.meta ?? '') as string
      const lang = getLanguage(props.className)
      // Syntax highlight
      let shikiRoot = node
      const rootElm = shiki.codeToHast(code, {
        themes: themeOptions,
        lang: lang.replace('diff-', ''),
        transformers: [
          // transformerMetaWordHighlight({
          //   className: HighLightWordClassName,
          // }),
          transformerNotationWordHighlight({
            matchAlgorithm: 'v3',
            classActiveWord: HighLightWordClassName,
          }),
          transformerNotationHighlight({
            matchAlgorithm: 'v3',
            classActiveLine: HighLightLineClassName,
          }),
          transformerNotationDiff({
            matchAlgorithm: 'v3',
            classLineAdd: DiffInsertedClassName,
            classLineRemove: DiffDeletedClassName,
          }),
          shikiClassTransformer({
            map: shikiMap,
            deletedKeys: [
              '--shiki-dark',
              'text-decoration',
              '--shiki-dark-text-decoration',
            ],
          }),
          customShikiTranformer({
            meta,
            lang,
          }),
        ],
      })
      const preElm = rootElm.children[0]
      if (preElm && preElm.type === 'element' && preElm.tagName === 'pre') {
        const codeElm = preElm.children[0]
        if (
          codeElm &&
          codeElm.type === 'element' &&
          codeElm.tagName === 'code'
        ) {
          shikiRoot = codeElm
        }
      }

      node.children = shikiRoot.children
      return 'skip'
    })
  }
}

export default rehypeShikiPlugin
