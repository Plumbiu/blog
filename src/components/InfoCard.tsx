import Link from 'next/link'
import Typography from '@mui/material/Typography'
import { profileInfo as useProfile } from '@plumbiu/github-info'
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
import EamilIcon from '@mui/icons-material/Email'
import GithubIcon from '@mui/icons-material/GitHub'
import LocationIcon from '@mui/icons-material/HomeOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkIcon from '@mui/icons-material/Link'

export default async function InfoCard() {
  const profile = await useProfile('Plumbiu')
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
    { primary: profile.location, icon: <LocationIcon /> },
    {
      primary: profile.twitter,
      icon: <TwitterIcon />,
      href: 'https://twitter.com/Plumbiu',
    },
    {
      primary: profile.blog,
      icon: <LinkIcon />,
      href: profile.blog,
    },
  ]
  const infoGithub = [
    {
      primary: 'Repos',
      count: profile.public_repos.length,
      href: 'https://github.com/Plumbiu?tab=repositories',
    },
    {
      primary: 'Followers',
      count: profile.followers.length,
      href: 'https://github.com/Plumbiu?tab=followers',
    },
    {
      primary: 'Following',
      count: profile.following.length,
      href: 'https://github.com/Plumbiu?tab=following',
    },
  ]
  const infoBlog = [
    { primary: '文章', href: '/article' },
    { primary: '标签', href: '/tags' },
    { primary: '分类', href: '/categories' },
  ]
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '10%',
        left: '15px',
        py: 2,
        width: '100%',
        maxWidth: 300,
        bgcolor: 'background.paper',
      }}
    >
      <List>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Link href="https://github.com/Plumbiu">
              <Avatar
                sx={{ width: 56, height: 56 }}
                alt={profile.name}
                src={profile.avatar}
              />
            </Link>
          </ListItemAvatar>
          <ListItemText
            sx={{
              px: 2,
            }}
            primary={`👋 ${profile.name}`}
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
                {` — ${profile.bio}`}
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
                <Badge
                  color="secondary"
                  badgeContent={profile.public_repos.length}
                >
                  {primary}
                </Badge>
              </Button>
            ))}
          </Stack>
        </ListItem>
        {infoMap.map(({ icon, primary, href }) => (
          <ListItem disablePadding key={href}>
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
  )
}
