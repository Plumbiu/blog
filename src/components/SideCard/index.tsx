import { Box } from '@mui/material'
import Side from '../ui/Side'
import ListTop from './ListTop'
import ListBottom from './ListBottom'
import EamilIcon from '@mui/icons-material/Email'
import GithubIcon from '@mui/icons-material/GitHub'
import LocationIcon from '@mui/icons-material/HomeOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkIcon from '@mui/icons-material/Link'
import { public_repos, followers, following } from '@/app/Plumbiu.json'

const infoGithub = [
  {
    primary: 'Repos',
    href: 'https://github.com/Plumbiu?tab=repositories',
    count: public_repos.length,
  },
  {
    primary: 'Followers',
    href: 'https://github.com/Plumbiu?tab=followers',
    count: followers.length,
  },
  {
    primary: 'Following',
    href: 'https://github.com/Plumbiu?tab=following',
    count: following.length,
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
  // const artilceNum = await useRequest<number>('article/total')
  // const tagNum = await useRequest<number>('tags/total')
  // const categoryNum = await useRequest<number>('categories/total')

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
