import type { Metadata } from 'next'
import '@plumbiu/md/style/github-markdown.css'
import '@plumbiu/md/style/hljs-markdown.css'
import { md2html } from '@plumbiu/md'
import { useGet } from '@/lib/api'
import TocCmp from '@/components/app/Toc'
import { name } from '~/config.json'
import Main from '@/components/app/Container/Main'
import PostCmp from '@/components/app/Post'

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
  const { content, title, tags, categories, date, updated } =
    await useGet<IArticle>('article/' + params.id)
  const html = await md2html(content)

  return (
    <>
      <TocCmp
        html={html}
        title={title}
        tags={tags}
        categories={categories}
        date={date}
        updated={updated}
      />
      <PostCmp html={html} />
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title, desc, tags, categories } = await useGet<IArticle>(
    'article/' + params.id,
  )

  return {
    title: `${name} | 文章 - ${title}`,
    description: desc,
    keywords: tags,
    category: categories.join(','),
  }
}
