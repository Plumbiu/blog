import Chips from '@/components/ui/Chips'
import { useGet } from '@/lib/api'

const Category = async () => {
  const categories = await useGet<Tag[]>('category')
  return <Chips path="category" chips={categories} />
}

export default Category
