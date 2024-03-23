import type { Metadata } from 'next'
import { getTocs } from '@/lib/md/index'
import { useGet } from '@/lib/api'
import TocCmp from '@/components/app/Toc'
import PostCmp from '@/components/app/Post'
import '@/components/app/Post/index.css'
import './index.css'
import '@/styles/md/hljs.css'
import '@/styles/md/github-markdown.css'

interface Props {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  const posts = await useGet<IFrontMatter[]>('article')
  const ids = posts.map((post) => ({
    id: post.id,
  }))

  return ids
}

export default async function PostId({ params }: Props) {
  const { content } = await useGet<IArticle>('article/' + params.id)
  const { tocs } = await getTocs(content)

  return (
    <div className="Post-Wrap">
      <PostCmp md={content} />
      <TocCmp tocs={tocs} />
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title, tags, categories } = await useGet<IArticle>(
    'article/' + params.id,
  )

  return {
    title,
    keywords: tags,
    category: categories.join(','),
  }
}
