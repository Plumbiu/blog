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

export default async function ({ params }: Props) {
  const { content, title, tags, categories, date, updated } =
    await useRequest<Article>('article/' + params.id)
  const html = await renderMD(content)
  return (
    <>
      <Toc
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
            padding: '16px 20px',
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title, desc, tags, categories } = await useRequest<Article>(
    'article/' + params.id,
  )

  return {
    title: '文章 - ' + title,
    description: desc,
    keywords: tags,
    category: categories.join(','),
  }
}
