import Chips from '@/components/ui/Chips'
import { useGet } from '@/lib/api'

const Tag = async () => {
  const tags = await useGet<Tag[]>('tag')
  return (
    <div
      style={{
        width: '80%',
      }}
    >
      <Chips path="tag" chips={tags} />
    </div>
  )
}

export default Tag
