import Hr from '../Hr'
import type { FC } from 'react'
import Button from '../Button'
import Stack from '../Stack'

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
      <Stack>
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
