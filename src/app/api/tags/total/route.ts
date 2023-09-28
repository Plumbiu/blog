import { getTags } from '@/lib/node/tags'
import { NextResponse } from 'next/server'

export async function GET() {
  const map = await getTags()
  return NextResponse.json(map.size)
}
