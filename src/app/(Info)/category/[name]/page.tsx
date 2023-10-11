import type { Metadata } from 'next'
import { useGet } from '@/lib/api'
import ArticleBanner from '@/components/ui/Banner'
import Badge from '@/components/ui/Badge'
import Tag from '@/components/ui/Tag'
import Title from '@/components/ui/Title'

interface Props {
  params: {
    name: string
  }
}

export async function generateStaticParams() {
  const categories = await useGet<Tag[]>('category')

  return categories.map(category => ({
    name: category.name,
  }))
}

const TagsName = async ({ params }: Props) => {
  const posts = await useGet<IFullFrontMatter[]>(
    'article?category=' + params.name,
  )

  return (
    <>
      <Title>分类页</Title>
      <div
        style={{
          marginTop: '16px',
          textAlign: 'center',
        }}
      >
        <Badge count={posts.length}>
          <Tag
            text={decodeURI(params.name)}
            link={'/tag/' + params.name}
            plain
          />
        </Badge>
      </div>
      <ArticleBanner posts={posts} name={params.name} />
    </>
  )
}

export default TagsName

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: 'Plumbiu | 分类 - ' + params.name,
    description: 'Plumbiu 的分类页 - ' + params.name,
  }
}
