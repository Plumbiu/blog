import { Metadata } from 'next'
import React from 'react'
import { getCategory, removeMdSuffix, upperFirstChar } from '@/utils'
import NotFound from '@/components/NotFound'
import { getPostPaths, getPostList, PostList } from '@/utils/node'
import { FrontmatterKey } from '@/constants'
import Card from '@/components/Card'
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

async function getPostContent(
  type: string,
  id: string,
): Promise<PostList | undefined> {
  try {
    const posts = await getPostList(type)
    const post = posts.find((post) => post.path === `posts/${type}/${id}`)
    if (!post) {
      return
    }
    return post
  } catch (error) {}
}

interface PostProps {
  params: Promise<{
    id: string
    type: FrontmatterKey
  }>
}

async function Post(props: PostProps) {
  const params = await props.params
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

export async function generateMetadata(props: PostProps): Promise<Metadata> {
  const params = await props.params
  const info = await getPostContent(params.type, params.id)
  const category = getCategory(params.id)
  return {
    title: `${upperFirstChar(category)} - ${info?.meta.title}`,
  }
}

export default Post
