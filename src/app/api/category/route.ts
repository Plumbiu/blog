import { getCategories } from '@/lib/node/categories'
import { NextResponse } from 'next/server'

export async function GET() {
  const map = await getCategories()
  const categories: Category[] = []
  for (const [name, count] of map) {
    categories.push({
      name,
      count,
    })
  }
  return NextResponse.json(categories.sort((a, b) => b.count - a.count))
}
