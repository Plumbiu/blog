import { JSDOM } from 'jsdom'

export interface Toc {
  level: number
  content: string
  hash: string
}

export function genTocs(html: string) {
  const tocs: Toc[] = []
  const { window } = new JSDOM(html)
  const headings = window.document.querySelectorAll('h1,h2,h3')
  for (const heading of headings) {
    tocs.push({
      level: +heading.tagName.replace(/h/i, ''),
      content: heading.textContent!,
      hash: '#' + heading.id,
    })
  }
  return tocs
}
