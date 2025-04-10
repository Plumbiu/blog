import ArtlistAll from './list/[...slug]/page'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <ArtlistAll
      params={Promise.resolve({
        slug: ['blog', '1'],
      })}
    />
  )
}
