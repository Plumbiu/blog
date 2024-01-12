import Chips from '@/components/ui/Chips'
import { useGet } from '@/lib/api'

const Tag = async () => {
  const tags = await useGet<Tag[]>('tag')
  return (
    <div
      style={{
        backgroundColor: 'var(--blog-bg-main)',
      }}
    >
      <Chips path="tag" chips={tags} />
    </div>
  )
}

export default Tag
