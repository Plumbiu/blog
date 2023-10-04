import Button from '../Button'
import './ListCenter.css'
import Badge from '../Badge'
import ButtonListIcon from '../Button/ListIcon'
import {
  Email,
  GitHub,
  HomeOutlined as LocationIcon,
  Twitter,
  Link as LinkIcon,
} from '@mui/icons-material'
import { articleNum, tagNum, categoryNum } from '~/config/sideCard.json'

const blogInfo = [
  { primary: '文章', href: '/article/1', count: articleNum },
  { primary: '标签', href: '/tags', count: tagNum },
  { primary: '分类', href: '/categories', count: categoryNum },
]

const githubInfo = [
  {
    primary: 'Plumbiu',
    icon: <GitHub />,
    href: 'https://github.com/Plumbiu',
  },
  {
    primary: 'plumbiuzz@gmail.com',
    icon: <Email />,
  },
  { primary: 'Hang Zhou, China', icon: <LocationIcon /> },
  {
    primary: 'Plumbiu',
    icon: <Twitter />,
    href: 'https://twitter.com/Plumbiu',
  },
  {
    primary: 'https://blog.plumbiu.club/',
    icon: <LinkIcon />,
    href: 'https://blog.plumbiu.club/',
  },
]

const ListCenter = () => {
  return (
    <>
      <div className="List-Center-Badge">
        {blogInfo.map(({ href, primary, count }) => (
          <Badge key={primary} count={count}>
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
