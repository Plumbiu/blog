'use client'
import { type ReactNode } from 'react'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from '@mui/lab'
import LaptopMacIcon from '@mui/icons-material/LaptopMac'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import RepeatIcon from '@mui/icons-material/Repeat'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import Typography from '@mui/material/Typography'
import { events } from '@/assets/Plumbiu/index.json'
import { formatTime } from '@/lib/time'

const eventMap: Record<string, ReactNode> = {
  PushEvent: <LaptopMacIcon />,
  PullRequestEvent: <RepeatIcon />,
  CreateEvent: <AddCircleIcon />,
  WatchEvent: <RemoveRedEyeIcon />,
  ForkEvent: <LocalDiningIcon />,
  IssuesEvent: <ErrorOutlineIcon />,
}
export default function Home() {
  return (
    <div
      style={{
        padding: 5,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" component="span">
        🎉 我的开源之旅 🎉
      </Typography>
      <Timeline position="alternate">
        {events.map(({ id, created_at, actor, repo, type, payload }) => (
          <TimelineItem key={id}>
            <TimelineOppositeContent
              sx={{ m: 'auto 0' }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
              {formatTime(created_at)}
              <Typography
                variant="body2"
                sx={{
                  color: '#9C27B0',
                }}
              >
                {actor.name} {'>'} {repo} {'>'}{' '}
                {payload.ref?.slice(payload.ref.lastIndexOf('/') + 1) ?? 'main'}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color={type === 'PushEvent' ? 'primary' : 'success'}>
                {eventMap[type]}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span">
                {type.replace('Event', '')}
              </Typography>
              {type === 'PushEvent' && (
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#9C27B0',
                    }}
                  >
                    Message:
                  </Typography>
                  {payload?.commits?.map(({ message }) => (
                    <Typography variant="body2">{message}</Typography>
                  ))}
                </>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}
