'use client'
import { Button, Stack } from '@mui/material'
import Hr from '../ui/Hr'
import type { FC } from 'react'

interface Props {
  info: Array<{
    primary: string
    href: string
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
          py: 1,
        }}
      >
        {info.map(({ primary, href }) => (
          <Button key={href} component="a" href={href}>
            {primary}
          </Button>
        ))}
      </Stack>
    </>
  )
}

export default ListBottom
