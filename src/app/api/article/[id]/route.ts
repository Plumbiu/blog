import fs from 'node:fs/promises'
import path from 'node:path'
import type { NextRequest } from 'next/server'
import parseFM from 'simple-md-front-matter'
import { isFileNameLegal } from '@/lib/node/file'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const filePath = path.join(process.cwd(), 'posts', params.id)
  const MDIMAGE = /!\[.*\]\((.*)\)/g
  let content = await fs.readFile(filePath, 'utf-8')
  let url: string | undefined
  while ((url = MDIMAGE.exec(content)?.[1])) {
    const name = path.parse(url).name
    if (isFileNameLegal(name) && url.startsWith('http')) {
      content = content.replace(url, `/markdown/${params.id}/${name}.webp`)
    }
  }
  const article: IArticle = {
    id: params.id,
    ...parseFM<TRawFrontMatter>(content),
    content: content.slice(content.indexOf('---', 3) + 3),
  }

  return Response.json(article)
}
