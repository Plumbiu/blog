import Chips from '@/components/ui/Chips'
import { useGet } from '@/lib/api'

const Category = async () => {
  const categories = await useGet<Tag[]>('category')
  return (
    <div
      style={{
        width: '80%',
      }}
    >
      <Chips path="category" chips={categories} />
    </div>
  )
}

export default Category
