import Link from 'next/link'
import Typography from '@mui/material/Typography'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material'
import type { Follow, PublicRepos } from '@plumbiu/github-info'
import EamilIcon from '@mui/icons-material/Email'
import GithubIcon from '@mui/icons-material/GitHub'
import LocationIcon from '@mui/icons-material/HomeOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkIcon from '@mui/icons-material/Link'
import { useRequest } from '@/lib/api'

export default async function InfoCard() {
  const { followers, following, public_repos } = await useRequest<{
    followers: Follow[]
    following: Follow[]
    public_repos: PublicRepos[]
  }>('user')
  const infoMap = [
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
  const infoGithub = [
    {
      primary: 'Repos',
      count: public_repos.length,
      href: 'https://github.com/Plumbiu?tab=repositories',
    },
    {
      primary: 'Followers',
      count: followers.length,
      href: 'https://github.com/Plumbiu?tab=followers',
    },
    {
      primary: 'Following',
      count: following.length,
      href: 'https://github.com/Plumbiu?tab=following',
    },
  ]
  const infoBlog = [
    { primary: '文章', href: '/article' },
    { primary: '标签', href: '/tags' },
    { primary: '分类', href: '/categories' },
  ]
  return (
    <div className="blog-info">
      <Box
        sx={{
          bgcolor: 'background.paper',
        }}
      >
        <List>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Link href="https://github.com/Plumbiu">
                <Avatar
                  sx={{ width: 56, height: 56 }}
                  alt="Plumbiu"
                  src="https://avatars.githubusercontent.com/u/99574369?v=4"
                />
              </Link>
            </ListItemAvatar>
            <ListItemText
              sx={{
                px: 2,
              }}
              primary={'👋 Plumbiu'}
              secondary={
                <>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Bio
                  </Typography>
                  — Studprogrammeried at Hangzhou Dianzi University
                  (杭州电子科技大学) (HDU)，a front-end coder
                </>
              }
            />
          </ListItem>
          <Divider />
          <ListItem
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Stack direction="row" spacing={2}>
              {infoBlog.map(({ href, primary }) => (
                <Button key={href} component="a" href={href}>
                  <Badge color="secondary" badgeContent={public_repos.length}>
                    {primary}
                  </Badge>
                </Button>
              ))}
            </Stack>
          </ListItem>
          {infoMap.map(({ icon, primary, href }) => (
            <ListItem key={href} disablePadding>
              {href ? (
                <ListItemButton component="a" href={href} target="__blank">
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={primary} />
                </ListItemButton>
              ) : (
                <ListItemButton>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={primary} />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
        <Divider />
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          useFlexGap
          flexWrap="wrap"
          sx={{
            pt: 1,
          }}
        >
          {infoGithub.map(({ primary, href, count }) => (
            <Button key={href} component="a" href={href} target="__blank">
              <Badge color="secondary" badgeContent={count}>
                {primary}
              </Badge>
            </Button>
          ))}
        </Stack>
      </Box>
    </div>
  )
}
