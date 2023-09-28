import InfoCard from '@/components/SideCard'
import TagsCmp from '@/components/Tags'
import Container from '@/components/ui/Container'
import React from 'react'

// FIXME: client component is not support async/await
const Tags = () => {
  return (
    <Container>
      <InfoCard />
      <TagsCmp />
    </Container>
  )
}

export default Tags
