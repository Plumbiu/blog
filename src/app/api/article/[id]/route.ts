import { renderMD } from '@/lib/md'
import { NextResponse, type NextRequest } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import parseFM from 'simple-md-front-matter'
import { minify } from 'html-minifier-terser'

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const filePath = path.join(process.cwd(), 'src', 'posts', params.id)
  const raw = await fs.readFile(filePath, 'utf-8')
  const html = await minify(
    await renderMD(raw.slice(raw.indexOf('---', 3) + 3)),
  )
  const article: Article = {
    id: params.id,
    ...parseFM<RawMatter>(raw),
    content: html,
  }
  return NextResponse.json(article)
}
