import ArchiveCmp from '@/components/app/Archive'
import Title from '@/components/ui/Title'
import { useRequest } from '@/lib/api'

interface Props {
  params: {
    year: string
  }
}

export async function generateStaticParams() {
  const result = await useRequest<ArcheveYear[]>('archives/years')

  return result.map(({ year }) => ({ year }))
}

const ArcheveYear = async ({ params }: Props) => {
  const archeveYear = await useRequest<Archeve[]>('archives?year=' + params.year)
  return (
    <div>
      <Title>归档</Title>
      <ArchiveCmp archives={archeveYear} />
    </div>
  )
}

export default ArcheveYear
