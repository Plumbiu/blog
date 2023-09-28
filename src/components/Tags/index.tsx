import Main from '@/components/ui/Main'
import { Typography } from '@mui/material'
import type { FC } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  // tags: Tag[]
}

const TagsCmp: FC<Props> = () => {
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
        🎉 收录了 {37} 个 tag! 🎉
      </Typography>
    </Main>
  )
}

export default TagsCmp
