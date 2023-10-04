import type { Props } from './ListTop'
import type { FC } from 'react'
import Button from '../Button'
import './ListCenter.css'
import Badge from '../Badge'
import ButtonListIcon from '../Button/ListIcon'

const ListCenter: FC<Props> = ({ blogInfo, githubInfo }) => {
  return (
    <>
      <div className="List-Center-Badge">
        {blogInfo.map(({ href, primary, count }) => (
          <Badge count={count}>
            <Button key={href} link={href}>
              {primary}
            </Button>
          </Badge>
        ))}
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
