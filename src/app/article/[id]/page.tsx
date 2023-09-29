import { type FC } from 'react'
import type { Metadata } from 'next'
import '@/styles/github-markdown-light.css'
import 'highlight.js/styles/github.css'
import { useRequest } from '@/lib/api'
import Main from '@/components/ui/Main'
import Toc from '@/components/Toc'
import { renderMD } from '@/lib/md'

interface Props {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  const posts = await useRequest<FullFrontMatter[]>('article')
  const ids = posts.map((post) => ({
    id: post.id,
  }))
  return ids
}

const page: FC<Props> = async ({ params }) => {
  const { content, title, tags, categories, date, updated } =
    await useRequest<Article>('article/' + params.id)
  const html = await renderMD(content)
  return (
    <>
      <Toc
        id={params.id}
        html={html}
        title={title}
        tags={tags}
        categories={categories}
        date={date}
        updated={updated}
      />
      <Main>
        <div
          style={{
            padding: '16px 12px',
          }}
          className="md"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </Main>
    </>
  )
}

export default page

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title, content, tags, categories } = await useRequest<Article>(
    'article/' + params.id,
  )

  return {
    title: '文章 - ' + title,
    description: content.slice(0, 100),
    keywords: tags,
    category: categories.join(','),
  }
}
