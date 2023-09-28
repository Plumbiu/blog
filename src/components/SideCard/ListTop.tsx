'use client'
import {
  Avatar,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import Hr from '../ui/Hr'
import ListCenter from './ListCenter'
import type { FC, ReactNode } from 'react'

export interface Props {
  blogInfo: Array<{
    primary: string
    href: string
    count: number
  }>
  githubInfo: Array<{
    primary: string
    icon: ReactNode
    href?: string
  }>
}

const ListTop: FC<Props> = ({ blogInfo, githubInfo }) => {
  return (
    <List>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Link href="https://github.com/Plumbiu">
            <Avatar
              sx={{ width: 56, height: 56 }}
              alt={'Plumbiu'}
              src="/avatar.jpg"
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
              Studprogrammeried at Hangzhou Dianzi University (杭州电子科技大学)
              (HDU)，a front-end coder
            </>
          }
        />
      </ListItem>
      <Hr />
      <ListCenter blogInfo={blogInfo} githubInfo={githubInfo} />
    </List>
  )
}

export default ListTop
