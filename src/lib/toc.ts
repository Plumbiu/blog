import { JSDOM } from 'jsdom'

interface Toc {
  level: number
  id: string
}

export function genTocs(html: string) {
  const tocs: Toc[] = []
  const dom = new JSDOM(html)
  const headings = dom.window.document.querySelectorAll('h1,h2,h3')
  for (const heading of headings) {
    tocs.push({
      level: +heading.tagName.replace(/h/i, ''),
      id: heading.id,
    })
  }
  return tocs
}
