import fsp from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { Metadata } from 'next'
import React from 'react'
import {
  FrontMatterKey,
  getCategory,
  joinFormatPaths,
  removeMdSuffix,
  upperFirstChar,
} from '@/utils'
import NotFound from '@/app/components/NotFound'
import { getFrontmatter, getMarkdownPath } from '@/utils/node'
import styles from './page.module.css'
import Markdown from '../../components/Markdown'
import Toc from '../../components/Toc'
import FrontMatter from '../../components/FrontMatter'

interface PostContent {
  frontmatter: {
    title: string
    date: number
  }
  content: string
}

export async function generateStaticParams() {
  const mds = await getMarkdownPath()
  return mds.map((id) => {
    const tokens = id.split('/')
    return {
      id: removeMdSuffix(tokens[2]),
      type: tokens[1],
    }
  })
}

export async function getPostContent(
  type: string,
  id: string,
): Promise<PostContent | undefined> {
  try {
    const file = await fsp.readFile(
      path.join(process.cwd(), 'posts', type, `${decodeURI(id)}.md`),
      'utf-8',
    )
    const { frontmatter, mdContent } = getFrontmatter(file)
    if (!frontmatter || !mdContent) {
      return
    }
    return {
      frontmatter,
      content: mdContent,
    }
  } catch (error) {}
}

interface PostProps {
  params: {
    id: string
    type: FrontMatterKey
  }
}

async function Post({ params }: PostProps) {
  const info = await getPostContent(params.type, params.id)
  if (!info) {
    return <NotFound />
  }
  return (
    <div className={styles.wrap}>
      <div
        className="center"
        style={{
          margin: 0,
        }}
      >
        <FrontMatter {...info.frontmatter} />
        <Markdown content={info.content} />
      </div>
      <Toc />
    </div>
  )
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const info = await getPostContent(params.type, params.id)
  const category = getCategory(params.id)
  return {
    title: `${upperFirstChar(category)} - ${info?.frontmatter.title}`,
  }
}

export default Post