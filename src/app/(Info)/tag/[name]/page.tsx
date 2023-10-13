import type { Metadata } from 'next'
import Badge from '@/components/ui/Badge'
import ArticleBanner from '@/components/ui/Banner'
import Tag from '@/components/ui/Tag'
import { useGet } from '@/lib/api'
import { name } from '~/config.json'

interface Props {
  params: {
    name: string
  }
}

export async function generateStaticParams() {
  const tags = await useGet<Tag[]>('tag')

  return tags.map(tag => ({
    name: tag.name,
  }))
}

const TagsName = async ({ params }: Props) => {
  const posts = await useGet<IFrontMatter[]>('article?tag=' + params.name)

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
    title: `${name} | 标签 - ${params.name}`,
    description: `${name} 的标签页 - ${params.name}`,
  }
}
