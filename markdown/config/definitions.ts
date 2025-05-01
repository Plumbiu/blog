import type { DefinitionValue } from 'remark-definition'

export type DefinitionType = Record<string, DefinitionValue>

const definitionMap: DefinitionType = {
  'Next.js': {
    url: 'https://github.com/vercel/next.js',
  },
  shiki: { url: 'https://github.com/shikijs/shiki' },
  'highlight.js': { url: 'https://github.com/highlightjs/highlight.js' },
  'react-markdown': { url: 'https://github.com/remarkjs/react-markdown' },
  sharp: {
    url: 'https://github.com/lovell/sharp',
  },
  ShadowRoot: {
    url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/ShadowRoot',
  },
  remark: {
    url: 'https://github.com/remarkjs/remark',
  },
  rehype: {
    url: 'https://github.com/rehypejs/rehype',
  },
}

export default definitionMap
