import CategoriesCmp from '@/components/Categories'
import { useRequest } from '@/lib/api'

const Categories = async () => {
  const categories = await useRequest<Tag[]>('categories')

  return <CategoriesCmp categories={categories} />
}

export default Categories
