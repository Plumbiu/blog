'use client'
import type { FC, ReactNode } from 'react'
import { formatTime } from '@/lib/time'
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
} from '@mui/lab'
import { Typography } from '@mui/material'
import type { Event } from '@plumbiu/github-info'

interface Props {
  events: Event[]
  eventMap: Record<string, ReactNode>
}

const MyselfCmp: FC<Props> = ({ events, eventMap }) => {
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
                {type === 'PullRequestEvent' ? 'PR' : type.replace('Event', '')}
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
                  {payload?.commits?.map(({ message }, index) => (
                    <Typography key={message + index} variant="body2">
                      {message}
                    </Typography>
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

export default MyselfCmp
