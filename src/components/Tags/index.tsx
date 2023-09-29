import Main from '@/components/ui/Main'
import { Badge, Chip, Typography } from '@mui/material'
import type { FC } from 'react'

interface Props {
  tags: Tag[]
}

const TagsCmp: FC<Props> = ({ tags }) => {
  return (
    <Main>
      <Typography
        variant="h6"
        component="div"
        sx={{
          textAlign: 'center',
          py: 2,
        }}
      >
        🎉 收录了 {tags.length} 个 tag! 🎉
      </Typography>
      {tags.map(({ name, count }) => (
        <Badge
          key={name}
          badgeContent={count}
          color="primary"
          sx={{
            m: 1,
          }}
        >
          <Chip variant="outlined" label={name} clickable />
        </Badge>
      ))}
    </Main>
  )
}

export default TagsCmp
