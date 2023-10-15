import Button from '@/components/ui/Button'
import './index.css'
import Badge from '@/components/ui/Badge'
import ButtonListIcon from '@/components/ui/Button/ListIcon'
import { articleNum } from '~/config/sideCard.json'
import Stack from '@/components/ui/Stack'
import {
  GithubIcon,
  EmailIcon,
  LocationIcon,
  TwitterIcon,
  LinkIcon,
} from '@/components/icons'
import { github_name, twitter, url, location, email } from '~/config.json'

const info = [
  {
    primary: '开源之旅',
    href: '/opensource',
  },
]
const blogInfo = [
  { primary: '归档', href: '/archive' },
  { primary: '文章', href: '/article/1', count: articleNum },
  {
    primary: '朋友',
    href: '/friend',
  },
]

const githubInfo = [
  {
    primary: github_name,
    icon: <GithubIcon />,
    href: `https://github.com/${github_name}`,
  },
  {
    primary: email,
    icon: <EmailIcon />,
  },
  { primary: location, icon: <LocationIcon /> },
  {
    primary: twitter,
    icon: <TwitterIcon />,
    href: `https://twitter.com/${twitter}`,
  },
  {
    primary: url,
    icon: <LinkIcon />,
    href: url,
  },
]

const SideCardBottom = () => {
  return (
    <div className="List-Center">
      <div className="List-Center-Badge">
        {blogInfo.map(({ href, primary, count }) => (
          <Badge key={primary} count={count}>
            <Button link={href}>{primary}</Button>
          </Badge>
        ))}
      </div>
      <div className="List-Center-Btn-List">
        {githubInfo.map(({ icon, primary, href }) => (
          <ButtonListIcon
            key={href ?? primary}
            py={9}
            icon={icon}
            link={href}
            text={primary}
          />
        ))}
      </div>
      <Stack>
        {info.map(({ primary, href }) => (
          <Button prefetch={primary !== '留言板'} key={primary} link={href}>
            {primary}
          </Button>
        ))}
      </Stack>
    </div>
  )
}

export default SideCardBottom
