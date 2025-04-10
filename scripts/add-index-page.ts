import { writeFileSync } from 'node:fs'

const content = `
import ArtlistAll from './list/[...slug]/page'

export const dynamic = 'force-static'

// fix gitpage 404
export default function Page() {
  return (
    <ArtlistAll
      params={Promise.resolve({
        slug: ['blog', '1'],
      })}
    />
  )
}
`
writeFileSync('src/app/page.tsx', content, { encoding: 'utf-8' })
