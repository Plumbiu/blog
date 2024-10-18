import fsp from 'node:fs/promises'
import { Metadata } from 'next'
import Markdown from '../components/Markdown'
import Toc from '../components/Toc'
import FrontMatter from '../components/FrontMatter'
import { getCategory, upperFirstChar } from '@/utils'
import { getFrontmatter, getMarkdownPath } from '@/utils/node'

export async function generateStaticParams() {
  const posts = await getMarkdownPath()
  return posts.map((path) => ({
    id: path.split('/').slice(1),
  }))
}

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
  const url = `posts/${decodeURI(id.join('/'))}`
  let file = ''
  try {
    file = await fsp.readFile(`${url}.md`, 'utf-8')
  } catch (error) {
    file = error.message
  }
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
      <Toc title={info.frontmatter.title} />
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
