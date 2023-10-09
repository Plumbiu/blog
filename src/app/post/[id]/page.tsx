import type { Metadata } from 'next'
import '@/styles/github-markdown-light.css'
import 'highlight.js/styles/github.css'
import { useGet } from '@/lib/api'
import Main from '@/components/app/Container/Main'
import Toc from '@/components/app/Toc'
import { renderMD } from '@/lib/md'
import Title from '@/components/ui/Title'

interface Props {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  const posts = await useGet<IFullFrontMatter[]>('article')
  const ids = posts.map((post) => ({
    id: post.id,
  }))
  return ids
}

export default async function PostId({ params }: Props) {
  const { content, title, tags, categories, date, updated } =
    await useGet<IArticle>('article/' + params.id)
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
        <Title>{title}</Title>
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
  const { title, desc, tags, categories } = await useGet<IArticle>(
    'article/' + params.id,
  )

  return {
    title: 'Plumbiu | 文章 - ' + title,
    description: desc,
    keywords: tags,
    category: categories.join(','),
  }
}
