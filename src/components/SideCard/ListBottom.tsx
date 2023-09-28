'use client'
import { Badge, Button, Stack } from '@mui/material'
import Hr from '../ui/Hr'
import type { FC } from 'react'

interface Props {
  info: Array<{
    primary: string
    href: string
    count: number
  }>
}

const ListBottom: FC<Props> = ({ info }) => {
  return (
    <>
      <Hr />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        useFlexGap
        flexWrap="wrap"
        sx={{
          pt: 1,
        }}
      >
        {info.map(({ primary, href, count }) => (
          <Button key={href} component="a" href={href} target="__blank">
            <Badge badgeContent={count} color="primary">
              {primary}
            </Badge>
          </Button>
        ))}
      </Stack>
    </>
  )
}

export default ListBottom
