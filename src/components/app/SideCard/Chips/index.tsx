/* eslint-disable @stylistic/multiline-ternary */
import type { FC } from 'react'
import Stack from '@/components/ui/Stack'
import Tag from '@/components/ui/Tag'

interface Props {
  chips: Tag[] | Category[]
  path: string
}

const Chips: FC<Props> = ({ chips, path }) => {
  return (
    <Stack spacing={2}>
      {chips.map(({ name }) => (
        <Tag
          key={name}
          link={`/${path}/${name}`}
          text={name}
          plain
        />
      ))}
    </Stack>
  )
}

export default Chips
