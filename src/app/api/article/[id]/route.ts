import { NextResponse, NextRequest } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import parseFM from 'simple-md-front-matter'

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const filePath = path.join(process.cwd(), 'src', 'posts', params.id)
  const content = await fs.readFile(filePath, 'utf-8')
  const article: Article = {
    id: params.id,
    ...parseFM<RawMatter>(content),
    content: content.slice(content.indexOf('---', 3)),
  }
  return NextResponse.json(article)
}
