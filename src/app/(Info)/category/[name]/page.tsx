import type { Metadata } from 'next'
import { useGet } from '@/lib/api'
import ArticleBanner from '@/components/ui/Banner'
import Badge from '@/components/ui/Badge'
import Tag from '@/components/ui/Tag'
import { name } from '~/config.json'

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
  const posts = await useGet<IFrontMatter[]>('article?category=' + params.name)

  return (
    <>
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
    title: `${name} | 分类 - ${params.name}`,
    description: `${name} 的分类页 - ${params.name}`,
  }
}
