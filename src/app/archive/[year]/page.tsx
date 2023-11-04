import ArchiveCmp from '@/components/app/Archive'
import Nav from '@/components/app/Container/Nav'
import { useGet } from '@/lib/api'

interface Props {
  params: {
    year: string
  }
}

export async function generateStaticParams() {
  const result = await useGet<IArcheveYear[]>('archive/year')

  return result.map(({ year }) => ({ year }))
}

const ArcheveYear = async ({ params }: Props) => {
  const archeveYear = await useGet<IArcheve[]>('archive?year=' + params.year)

  return (
    <>
      <Nav scope="archive" />
      <ArchiveCmp archives={archeveYear} />
    </>
  )
}

export default ArcheveYear
