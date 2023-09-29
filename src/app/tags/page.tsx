import InfoCard from '@/components/SideCard'
import TagsCmp from '@/components/Tags'
import Container from '@/components/ui/Container'
import { useRequest } from '@/lib/api'
import React from 'react'

// FIXME: client component is not support async/await
const Tags = async () => {
  const tags = await useRequest<Tag[]>('tags')
  return (
    <Container>
      <InfoCard />
      <TagsCmp tags={tags} />
    </Container>
  )
}

export default Tags
