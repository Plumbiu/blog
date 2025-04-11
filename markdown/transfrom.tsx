import { compile } from '@mdx-js/mdx'
import { transform, type Options } from 'sucrase'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import rehypeShikiHighlight from '~/markdown/plugins/rehype/shiki/hightlight'
import rehypeElementPlugin from '~/markdown/plugins/rehype/element'
import remarkSlug from '~/markdown/plugins/remark/slug'
import { remarkContainerDirectivePlugin } from '~/markdown/plugins/remark/directive'
import remarkRunner from '~/markdown/plugins/remark/runner'
import remarkCodeConfig from '~/markdown/plugins/remark/code'
import { remarkPlainText } from '~/markdown/plugins/remark/plain-text/index'
import remarkCodeBlcok from '~/markdown/plugins/remark/code-block'
import { createElement } from 'react'
import CustomComponent from '~/data/components'
import { handleComponentName, handleComponentProps } from './plugins/constant'
import { optimizeProps } from './plugins/props-optimize'
import MarkdownImage from '@/app/posts/[...slug]/ui/Image'
import PreComponent from '@/components/Pre'
import { resolveAssetPath, isUnOptimized } from '@/lib'
import { getBase64Url } from '@/lib/client'
import { getAssetImagePath } from '@/lib/node/fs'
import type { ImageProps } from 'next/image'
import getBlurDataUrl from '~/optimize/blurhash'
import { customComponentMap } from '~/data/components/custom-components'

// This code is refactored into TypeScript based on
// https://github.com/remarkjs/react-markdown/blob/main/lib/index.js
/*
  LICENSE: https://github.com/remarkjs/react-markdown/blob/main/license

  The MIT License (MIT)

  Copyright (c) Espen Hovlandsdal

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

const transfromOptions: Options = {
  transforms: ['jsx', 'typescript', 'imports'],
  production: true,
}

async function transfromCode2Jsx(code: string) {
  const complied = await compile(code, {
    remarkPlugins: [
      remarkGfm,
      remarkDirective,
      remarkContainerDirectivePlugin,
      remarkSlug,
      remarkCodeConfig,
      remarkCodeBlcok,
      remarkRunner,
      [remarkPlainText, code],
    ],
    rehypePlugins: [rehypeElementPlugin, rehypeShikiHighlight],
  })
  const transformed = transform(
    String(complied).replace('use strict;', ''),
    transfromOptions,
  )

  const exports: Record<string, any> = {}
  const fn = new Function('exports', 'require', transformed.code)
  fn(exports, () => {
    return { Fragment, jsx, jsxs }
  })
  return createElement(exports.default, {
    components: {
      ...customComponentMap,
      div: (props: any) => {
        const { node, ...rest } = props
        const customComponentProps = handleComponentProps(rest)
        const componentProps = {
          ...rest,
          ...(customComponentProps ?? {}),
        }
        optimizeProps(componentProps)
        return <CustomComponent {...props} />
      },
      img: async (props: any) => {
        const { src, alt } = props
        if (!src || !alt) {
          return
        }
        if (src.endsWith('.mp4')) {
          return <video muted src={src} controls />
        }
        const imagePath = getAssetImagePath(src)
        const { base64, metadata } = await getBlurDataUrl(
          decodeURIComponent(imagePath),
        )
        const { width, height } = metadata ?? {}
        if (!width || !height || !base64) {
          return
        }
        const commonProps: ImageProps = {
          src: resolveAssetPath(`images/${src}`),
          alt,
          unoptimized: isUnOptimized(src),
          blurDataURL: getBase64Url(base64),
          placeholder: 'blur',
          width,
          height,
        }
        return <MarkdownImage {...commonProps} />
      },
      pre: (props: any) => {
        const { node, ...rest } = props
        const component = handleComponentName(props)
        const children = props.children
        optimizeProps(rest)
        if (component) {
          return <CustomComponent {...rest} />
        }
        return <PreComponent>{children}</PreComponent>
      },
    },
  })
}

export default transfromCode2Jsx
