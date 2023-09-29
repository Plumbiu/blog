import { JSDOM } from 'jsdom'

export interface Toc {
  level: number
  id: string
}

export function genTocs(html: string) {
  const tocs: Toc[] = []
  const { window } = new JSDOM(html)
  const headings = window.document.querySelectorAll('h1,h2,h3')
  for (const heading of headings) {
    heading.id = heading.textContent!.replace(/\s/g, '')
    tocs.push({
      level: +heading.tagName.replace(/h/i, ''),
      id: heading.textContent!,
    })
  }
  return tocs
}
