import ArchiveCmp from '@/components/app/Archive'
import { useGet } from '@/lib/api'
import '@/components/app/Archive/index.css'

const Archive = async () => {
  const archives = await useGet<IArcheve[]>('archive')

  return <ArchiveCmp archives={archives} />
}

export default Archive
