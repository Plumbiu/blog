import { Box } from '@mui/material'
import Side from '../ui/Side'
import ListTop from './ListTop'
import ListBottom from './ListBottom'
import EamilIcon from '@mui/icons-material/Email'
import GithubIcon from '@mui/icons-material/GitHub'
import LocationIcon from '@mui/icons-material/HomeOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkIcon from '@mui/icons-material/Link'

const infoGithub = [
  {
    primary: '朋友们',
    href: '/friends',
  },
  {
    primary: '留言板',
    href: '/comments',
  },
]

const githubInfo = [
  {
    primary: 'Plumbiu',
    icon: <GithubIcon />,
    href: 'https://github.com/Plumbiu',
  },
  {
    primary: 'plumbiuzz@gmail.com',
    icon: <EamilIcon />,
  },
  { primary: 'Hang Zhou, China', icon: <LocationIcon /> },
  {
    primary: 'Plumbiu',
    icon: <TwitterIcon />,
    href: 'https://twitter.com/Plumbiu',
  },
  {
    primary: 'https://blog.plumbiu.club/',
    icon: <LinkIcon />,
    href: 'https://blog.plumbiu.club/',
  },
]

export default function InfoCard() {
  const blogInfo = [
    { primary: '文章', href: '/article', count: 54 },
    { primary: '标签', href: '/tags', count: 37 },
    { primary: '分类', href: '/categories', count: 12 },
  ]
  return (
    <Side>
      <Box
        sx={{
          bgcolor: 'background.paper',
        }}
      >
        <ListTop blogInfo={blogInfo} githubInfo={githubInfo} />
        <ListBottom info={infoGithub} />
      </Box>
    </Side>
  )
}
