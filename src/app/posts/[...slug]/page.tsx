import type { Metadata } from 'next'
import { getCategory, removeMdSuffix, upperFirstChar } from '@/lib/shared'
import NotFound from '@/components/NotFound'
import { getPostsPath, getPostByPostType } from '~/markdown/utils/fs'
import { generateSeoMetaData, joinWebUrl } from '@/app/seo'
import styles from './page.module.css'
import Toc from './ui/Toc'
import Meta from './ui/Meta'
import Comment from './ui/Comment'
import './styles/md.css'
import './styles/shiki.css'
import transfromCode2Jsx from '~/markdown/transfrom'

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

  const node = await transfromCode2Jsx(info.content)

  return (
    <div className={styles.wrap}>
      <div
        className="center"
        style={{
          margin: 0,
        }}
      >
        <Meta title={info.meta.title} />
        <div className="md">{node}</div>
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
