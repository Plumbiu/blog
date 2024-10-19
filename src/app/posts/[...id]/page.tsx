import fsp from 'node:fs/promises'
import { Metadata } from 'next'
import React from 'react'
import Markdown from '../components/Markdown'
import Toc from '../components/Toc'
import FrontMatter from '../components/FrontMatter'
import { getCategory, removeFrontmatter, upperFirstChar } from '@/utils'
import fmJsons from '@/front_matter.json'

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
  const pathSuffix = `posts/${decodeURI(id.join('/'))}`
  const url = `${process.cwd()}/${pathSuffix}}`
  let file = ''
  try {
    file = await fsp.readFile(`${url}.md`, 'utf-8')
  } catch (error) {}
  const mdContent = removeFrontmatter(file)
  // @ts-ignore
  const frontmatter = fmJsons[pathSuffix]
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
