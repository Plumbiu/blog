import type { FC } from 'react'
import Badge from '../../Badge'
import Stack from '../../Stack'
import Tag from '../../Tag'

interface Props {
  chips: Tag[] | Category[]
  withBadge?: boolean
}

const Chips: FC<Props> = ({ chips: tags, withBadge = false }) => {
  return (
    <Stack spacing={2}>
      {tags.map(({ name, count }) => {
        return withBadge ? (
          <Badge key={name} count={count}>
            <Tag link={'/tags/' + name} text={name} plain />
          </Badge>
        ) : (
          <Tag link={'/tags/' + name} text={name} plain />
        )
      })}
    </Stack>
  )
}

export default Chips
