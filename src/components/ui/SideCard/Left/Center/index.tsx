import Button from '@/components/ui/Button'
import './index.css'
import Badge from '@/components/ui/Badge'
import ButtonListIcon from '@/components/ui/Button/ListIcon'
import { Email, GitHub, HomeOutlined as LocationIcon, Twitter, Link as LinkIcon } from '@mui/icons-material'
import { articleNum } from '~/config/sideCard.json'
import Stack from '@/components/ui/Stack'

const info = [
  {
    primary: '朋友们',
    href: '/friends',
  },
  {
    primary: '留言板',
    href: '/comments',
  },
  {
    primary: '开源之旅',
    href: '/opensource',
  },
]
const blogInfo = [
  { primary: '归档', href: '/archives' },
  { primary: '文章', href: '/article/1', count: articleNum },
  { primary: '关于', href: '/about' },
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

const SideCardCenter = () => {
  return (
    <div className="List-Center">
      <div className="List-Center-Badge">
        {blogInfo.map(({ href, primary, count }) => (
          <Badge key={primary} count={count}>
            <Button link={href}>{primary}</Button>
          </Badge>
        ))}
      </div>
      <div className='List-Center-Btn-List'>
        {githubInfo.map(({ icon, primary, href }) => (
          <ButtonListIcon key={href ?? primary} py={10} icon={icon} link={href} text={primary}></ButtonListIcon>
        ))}
      </div>
      <Stack spacing={16}>
        {info.map(({ primary, href }) => (
          <Button key={primary} link={href}>
            {primary}
          </Button>
        ))}
      </Stack>
    </div>
  )
}

export default SideCardCenter
