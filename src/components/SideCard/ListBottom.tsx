import Hr from '../ui/Hr'
import type { FC } from 'react'
import Button from '../ui/Button'
import Stack from '../ui/Stack'

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
      <Stack spacing={2}>
        {info.map(({ primary, href }) => (
          <Button key={primary} link={href}>
            {primary}
          </Button>
        ))}
      </Stack>
    </>
  )
}

export default ListBottom
