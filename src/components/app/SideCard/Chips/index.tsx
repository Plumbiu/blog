import type { FC } from 'react'
import Badge from '@/components/ui/Badge'
import Stack from '@/components/ui/Stack'
import Tag from '@/components/ui/Tag'

interface Props {
  chips: Tag[] | Category[]
  path: string
  withBadge?: boolean
}

const Chips: FC<Props> = ({ chips: tags, withBadge = false, path }) => {
  return (
    <Stack spacing={2}>
      {tags.map(({ name, count }) => {
        return withBadge ?
          (
            <Badge key={name} count={count}>
              <Tag link={`/${path}/${name}`} text={name} plain />
            </Badge>
          ) :
          (
            <Tag
              key={name} link={`/${path}/${name}`} text={name}
              plain
            />
          )
      })}
    </Stack>
  )
}

export default Chips
