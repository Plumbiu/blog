import type { Props } from './ListTop'
import type { FC } from 'react'
import Button from '../ui/Button'
import Stack from '../ui/Stack'
import Badge from '../ui/Badge'
import ButtonListIcon from '../ui/Button/ListIcon'

const ListCenter: FC<Props> = ({ blogInfo, githubInfo }) => {
  return (
    <>
      <div>
        <Stack spacing={2}>
          {blogInfo.map(({ href, primary, count }) => (
            <Button key={href} link={href}>
              <Badge count={count}>{primary}</Badge>
            </Button>
          ))}
        </Stack>
      </div>
      {githubInfo.map(({ icon, primary, href }) => (
        <ButtonListIcon
          key={href ?? primary}
          icon={icon}
          link={href}
          text={primary}
        ></ButtonListIcon>
      ))}
    </>
  )
}

export default ListCenter
