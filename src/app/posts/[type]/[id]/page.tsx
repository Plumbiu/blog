import { Metadata } from 'next'
import React from 'react'
import { getCategory, removeMdSuffix, upperFirstChar } from '@/utils'
import NotFound from '@/components/NotFound'
import { getPostPaths, getPostList, PostList } from '@/utils/node/markdown'
import { BlogUrl } from '~/data/site'
import { FrontmatterKey } from '@/constants'
import styles from './page.module.css'
import Toc from '../../components/Toc'
import Meta from '../../components/Meta'
import '../../styles/md.css'
import '../../styles/shiki.css'
import transfromCode2Jsx from '../../utils/transfrom'

export async function generateStaticParams() {
  const mds = await getPostPaths()
  return mds.map((id) => {
    const tokens = id.split('/')
    return {
      id: removeMdSuffix(tokens[2]),
      type: tokens[1],
    }
  })
}

async function getPostContent(type: string, id: string) {
  try {
    const posts = await getPostList(type)
    const post = posts.find((post) => post.path === `posts/${type}/${id}`)
    return post
  } catch (error) {}
}

interface PostProps {
  params: {
    id: string
    type: FrontmatterKey
  }
}

function joinWebUrl(...args: string[]) {
  let url = ''
  for (const arg of args) {
    url += arg
    if (!arg.endsWith('/')) {
      url += arg
    }
  }
  return url
}

const Desc_Max_Length = 40

async function Post({ params }: PostProps) {
  const info = await getPostContent(params.type, params.id)
  if (!info) {
    return <NotFound />
  }
  const node = await transfromCode2Jsx(info.content)
  return (
    <div className={styles.wrap}>
      <div
        className="center"
        style={{
          margin: 0,
        }}
      >
        <Meta {...info} />
        <div className="md">{node}</div>
      </div>
      <Toc />
    </div>
  )
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const info = await getPostContent(params.type, params.id)
  const category = upperFirstChar(getCategory(params.id))
  if (!info) {
    return {
      title: `${category} - ${params.id}`,
    }
  }
  return {
    title: `${category} - ${info.meta.title}`,
    description: info.meta.desc.slice(0, Desc_Max_Length),
    openGraph: {
      title: info.meta.title,
      description: info?.meta.desc,
      url: BlogUrl,
      // eslint-disable-next-line @stylistic/quotes
      siteName: "Plumbiu's blog",
      locale: 'zh_CN',
      type: 'website',
    },
  }
}

export default Post
