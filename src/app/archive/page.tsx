import ArchiveCmp from '@/components/app/Archive'
import Nav from '@/components/app/Container/Nav'
import { useGet } from '@/lib/api'

const Archive = async () => {
  const archives = await useGet<IArcheve[]>('archive')

  return (
    <>
      <Nav scope="archive" />
      <ArchiveCmp archives={archives} />
    </>
  )
}

export default Archive
