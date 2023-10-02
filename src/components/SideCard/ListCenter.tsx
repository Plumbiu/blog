import type { Props } from './ListTop'
import type { FC } from 'react'
import Button from '../ui/Button'
import Stack from '../ui/Stack'
import Badge from '../ui/Badge'
import ButtonIcon from '../ui/Button/Icon'

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
      {githubInfo.map(({ icon, primary, href }) =>
        href ? (
          <ButtonIcon
            icon={icon}
            key={href ?? primary}
            link={href}
            text={primary}
          ></ButtonIcon>
        ) : (
          <ButtonIcon
            icon={icon}
            key={href ?? primary}
            text={primary}
          ></ButtonIcon>
        ),
      )}
    </>
  )
}

export default ListCenter
