import Stack from '@/components/ui/Stack'
import './index.css'
import { Email, GitHub, HomeOutlined as LocationIcon, Twitter, Link as LinkIcon } from '@mui/icons-material'
import Link from 'next/link'

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

const SideCardBottom = () => {
  return (
    <div className="List-Bottom">
      <Stack spacing={16}>{githubInfo.map(({ icon, primary, href }) => href && <Link href={href}>{icon}</Link>)}</Stack>
    </div>
  )
}

export default SideCardBottom
