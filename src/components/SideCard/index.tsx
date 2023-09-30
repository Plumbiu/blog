import { Box } from '@mui/material'
import Side from '../ui/Side'
import ListTop from './ListTop'
import ListBottom from './ListBottom'
import {
  Email,
  GitHub,
  HomeOutlined as LocationIcon,
  Twitter,
  Link as LinkIcon,
} from '@mui/icons-material'
import { articleNum, tagNum, categoryNum } from '@/config/sideCard.json'

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

export default function InfoCard() {
  const blogInfo = [
    { primary: '文章', href: '/article/1', count: articleNum },
    { primary: '标签', href: '/tags', count: tagNum },
    { primary: '分类', href: '/categories', count: categoryNum },
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
