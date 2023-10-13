import type { Metadata } from 'next'
import '@plumbiu/md/style/github-markdown-light.css'
import '@plumbiu/md/style/hljs-markdown-light.css'
import { md2html } from '@plumbiu/md'
import { useGet } from '@/lib/api'
import Main from '@/components/app/Container/Main'
import TocCmp from '@/components/app/Toc'

interface Props {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  const posts = await useGet<IFrontMatter[]>('article')
  const ids = posts.map(post => ({
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
      <Main>
        <div
          style={{
            padding: '16px 20px',
          }}
        >
          <div
            className="md"
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />
          <div id="Post-Bottom">Comment 页面</div>
        </div>
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
