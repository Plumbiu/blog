import Chips from '@/components/ui/Chips'
import { useGet } from '@/lib/api'

const Tag = async () => {
  const tags = await useGet<Tag[]>('tag')
  return <Chips path="tag" chips={tags} />
}

export default Tag
