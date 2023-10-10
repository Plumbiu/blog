import ArchiveCmp from '@/components/app/Archive'
import Title from '@/components/ui/Title'
import { useGet } from '@/lib/api'
import React from 'react'

const Archive = async () => {
  const archives = await useGet<IArcheve[]>('archive')
  return (
    <>
      <Title>归档</Title>
      <ArchiveCmp archives={archives} />
    </>
  )
}

export default Archive
