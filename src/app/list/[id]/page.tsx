import { PostDir } from '@/constants'
import ArtlistAll from './[pagenum]/page'

interface Params {
  id: string
  pagenum: string
}

export async function generateStaticParams() {
  return PostDir.map((id) => ({
    id,
  }))
}

interface ListProps {
  params: Promise<Params>
}

async function ArtList(props: ListProps) {
  const params = await props.params
  const id = params.id
  return (
    <ArtlistAll
      params={Promise.resolve({
        id,
        pagenum: '1',
      })}
    />
  )
}
export default ArtList
