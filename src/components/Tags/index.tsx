import type { FC } from 'react'
import Title from '../ui/Title'
import Badge from '../ui/Badge'
import Stack from '../ui/Stack'
import Tag from '../ui/Tag'

interface Props {
  tags: Tag[]
}

const TagsCmp: FC<Props> = ({ tags }) => {
  return (
    <>
      <Title>🎉 收录了 {tags.length} 个 tag! 🎉</Title>
      <Stack>
        {tags.map(({ name, count }) => (
          <Badge key={name} count={count}>
            <Tag link={'/tags/' + name} text={name} plain />
          </Badge>
        ))}
      </Stack>
    </>
  )
}

export default TagsCmp
