import fsp from 'node:fs/promises'
import path from 'node:path'
import { Metadata } from 'next'
import React from 'react'
import Markdown from '../components/Markdown'
import Toc from '../components/Toc'
import FrontMatter from '../components/FrontMatter'
import { getCategory, upperFirstChar } from '@/utils'
import { getFrontmatter, getMarkdownPath } from '@/utils/node'

interface PostContent {
  frontmatter: {
    title: string
    date: number
  }
  content: string
}

export async function getPostContent(
  id: string[],
): Promise<PostContent | undefined> {
  const url = path.join(
    process.cwd(),
    'posts',
    ...id.map((item) => decodeURI(item)),
  )
  let file = ''
  try {
    file = await fsp.readFile(`${url}.md`, 'utf-8')
  } catch (error) {}
  const { frontmatter, mdContent } = getFrontmatter(file)
  if (!frontmatter || !mdContent) {
    return
  }
  return {
    frontmatter,
    content: mdContent,
  }
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
    <div>
      <div className="center">
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
