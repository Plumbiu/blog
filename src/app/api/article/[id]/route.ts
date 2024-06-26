import fs from 'node:fs/promises'
import path from 'node:path'
import type { NextRequest } from 'next/server'
import parseFM from 'simple-md-front-matter'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const filePath = path.join(process.cwd(), 'posts', params.id)
  let content = await fs.readFile(filePath, 'utf-8')

  const article: IArticle = {
    id: params.id,
    ...parseFM<TRawFrontMatter>(content),
    readTime: Math.floor(content.length / 225),
    content: content.slice(content.indexOf('---', 3) + 3),
  }

  return Response.json(article)
}
