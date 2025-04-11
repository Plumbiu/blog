import type { Metadata } from 'next'
import type { ImageProps } from 'next/image'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import {
  getCategory,
  isUnOptimized,
  removeMdSuffix,
  resolveAssetPath,
  upperFirstChar,
} from '@/lib'
import NotFound from '@/components/NotFound'
import { getPostsPath, getPostByPostType } from '@/lib/node/markdown'
import { generateSeoMetaData, joinWebUrl } from '@/app/seo'
import styles from './page.module.css'
import Toc from './ui/Toc'
import Meta from './ui/Meta'
import Comment from './ui/Comment'
import './styles/md.css'
import './styles/shiki.css'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import rehypeElementPlugin from '~/markdown/plugins/rehype/element'
import rehypeShikiHighlight from '~/markdown/plugins/rehype/shiki/hightlight'
import remarkCodeConfig from '~/markdown/plugins/remark/code'
import remarkCodeBlcok from '~/markdown/plugins/remark/code-block'
import { remarkContainerDirectivePlugin } from '~/markdown/plugins/remark/directive'
import { remarkPlainText } from '~/markdown/plugins/remark/plain-text'
import remarkRunner from '~/markdown/plugins/remark/runner'
import remarkSlug from '~/markdown/plugins/remark/slug'
import { customComponentMap } from '~/data/components/custom-components'
import PreComponent from '@/components/Pre'
import { getBase64Url } from '@/lib/client'
import { getAssetImagePath } from '@/lib/node/fs'
import CustomComponent from '~/data/components'
import {
  handleComponentProps,
  handleComponentName,
} from '~/markdown/plugins/constant'
import { optimizeProps } from '~/markdown/plugins/props-optimize'
import getBlurDataUrl from '~/optimize/blurhash'
import MarkdownImage from './ui/Image'

export async function generateStaticParams() {
  const mds = await getPostsPath()
  return mds.map((md) => {
    // md like:     posts/note/custom-component
    // with locale: post/note/en/custom-component
    const tokens = md.split('/')
    const id = removeMdSuffix(tokens[tokens.length - 1])
    const isLocale = tokens.length === 4
    const locale = isLocale ? tokens[tokens.length - 2] : undefined
    const slug = locale ? [tokens[1], locale, id] : [tokens[1], id]
    return {
      slug,
    }
  })
}

async function getPostContent(type: string, id: string) {
  try {
    const posts = await getPostByPostType(type)
    const post = posts.find((post) => post.path === `posts/${type}/${id}`)
    return post
  } catch (error) {}
}

interface PostProps {
  params: Promise<{
    // [type, title, locale]
    slug: [string, string, string]
  }>
}

const DescMaxLen = 40

async function Post(props: PostProps) {
  const params = await props.params
  const [type, ...data] = params.slug
  const info = await getPostContent(type, data.join('/'))
  if (!info) {
    return <NotFound />
  }
  const id = data[data.length - 1]
  const code = info.content

  const { default: MDXContent } = await evaluate(code, {
    ...runtime,
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

  return (
    <div className={styles.wrap}>
      <div
        className="center"
        style={{
          margin: 0,
        }}
      >
        <Meta title={info.meta.title} />
        <div className="md">
          {MDXContent({
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
          })}
        </div>
        <Comment pathname={`posts/${type}/${id}`} />
      </div>
      <Toc />
    </div>
  )
}

export async function generateMetadata(props: PostProps): Promise<Metadata> {
  const params = await props.params
  const [type, ...data] = params.slug
  const id = data[data.length - 1]
  const info = await getPostContent(type, id)
  const category = upperFirstChar(getCategory(id))
  if (!info) {
    return {
      title: `${category} - ${id}`,
    }
  }
  const title = `${info.meta.title} | ${category}`
  return {
    title,
    description: info.meta.desc?.slice(0, DescMaxLen),
    ...generateSeoMetaData({
      title,
      description: info.meta.desc?.slice(0, 20),
      url: joinWebUrl('posts', type, id),
    }),
  }
}

export default Post
