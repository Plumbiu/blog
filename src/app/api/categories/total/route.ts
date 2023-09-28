import { getCategories } from '@/lib/node/categories'
import { NextResponse } from 'next/server'

export async function GET() {
  const map = await getCategories()
  return NextResponse.json(map.size)
}
