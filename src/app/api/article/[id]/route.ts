import { NextResponse, type NextRequest } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import parseFM from 'simple-md-front-matter'

export async function GET(_req: NextRequest, { params }: { params: IArticleParams }) {
  const filePath = path.join(process.cwd(), 'posts', params.id)
  const content = await fs.readFile(filePath, 'utf-8')

  const article: IArticle = {
    id: params.id,
    ...parseFM<IRawMatter>(content),
    content: content.slice(content.indexOf('---', 3) + 3),
  }
  return NextResponse.json(article)
}
