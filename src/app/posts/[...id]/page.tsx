import fsp from 'node:fs/promises'
import { Metadata } from 'next'
import React from 'react'
import styles from './page.module.css'
import Markdown from '../components/Markdown'
import Toc from '../components/Toc'
import FrontMatter from '../components/FrontMatter'
import {
  getCategory,
  joinFormatPaths,
  removeFrontmatter,
  upperFirstChar,
} from '@/utils'
import fmJsons from '@/front_matter.json'
import path from 'node:path'

interface PostContent {
  frontmatter: {
    title: string
    date: number
  }
  content: string
}

export function generateStaticParams() {
  const paths = Object.keys(fmJsons)
  return paths.map((id) => ({
    id: id.split('/').slice(1),
  }))
}

export async function getPostContent(
  id: string[],
): Promise<PostContent | undefined> {
  const relaivePath = joinFormatPaths('posts', decodeURI(id.join('/')))
  try {
    const file = await fsp.readFile(
      path.join(process.cwd(), `${relaivePath}.md`),
      'utf-8',
    )
    const mdContent = removeFrontmatter(file)
    // @ts-ignore
    const frontmatter = fmJsons[relaivePath]
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
    id: string[]
  }
}

async function Post({ params }: PostProps) {
  const info = await getPostContent(params.id)
  if (!info) {
    return null
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
  const info = await getPostContent(params.id)
  const category = getCategory(params.id)
  return {
    title: `${upperFirstChar(category)} - ${info?.frontmatter.title}`,
  }
}

export default Post
