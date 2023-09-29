import { type FC } from 'react'
import type { Metadata } from 'next'
import '@/styles/github-markdown-light.css'
import 'highlight.js/styles/github.css'
import { useRequest } from '@/lib/api'
import Main from '@/components/ui/Main'
import Toc from '@/components/Toc'
import Container from '@/components/ui/Container'

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
  console.log(ids)

  return ids
}

const page: FC<Props> = async ({ params }) => {
  const { content, title, tags, categories, date, updated } =
    await useRequest<Article>('article/' + params.id)
  return (
    <Container>
      <Toc
        id={params.id}
        html={content}
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
            __html: content,
          }}
        />
      </Main>
    </Container>
  )
}

export default page

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await useRequest<Article>('article/' + params.id)

  return {
    title: '文章 - ' + data.title,
    description: data.desc,
    keywords: data.tags,
    category: data.categories.join(','),
  }
}
