import type { ReactNode } from 'react'
import { formatTime } from '@/lib/time'
import Title from '../ui/Title'
import TimeLine from '../ui/TimeLine'
import { LaptopMac, AddCircle, RemoveRedEye, Repeat, ErrorOutline, LocalDining } from '@mui/icons-material'
import events from '~/config/events.json'
import './index.css'

const eventMap: Record<string, ReactNode> = {
  PushEvent: <LaptopMac />,
  PullRequestEvent: <AddCircle />,
  CreateEvent: <RemoveRedEye />,
  WatchEvent: <Repeat />,
  ForkEvent: <LocalDining />,
  IssuesEvent: <ErrorOutline />,
}

const bgcolorMap: Record<string, string> = {
  PushEvent: '#1976d2',
  PullRequestEvent: '#673AB7',
  CreateEvent: '#C6FF00',
  WatchEvent: '#009688',
  ForkEvent: '#3F51B5',
  IssuesEvent: '#333',
}

const OpenSourceCmp = () => {
  return (
    <div className="OpenSource">
      <Title>🎉 我的开源之旅 🎉</Title>
      {events.map(({ id, created_at, actor, repo, type, payload }) => (
        <TimeLine
          key={id}
          bgcolor={bgcolorMap[type]}
          left={
            <>
              {formatTime(created_at)}
              <div className="OpenSource-Left">
                {actor.name} {'>'} {repo} {'>'} {payload.ref?.slice(payload.ref.lastIndexOf('/') + 1) ?? 'main'}
              </div>
            </>
          }
          center={eventMap[type]}
          right={
            <>
              <div className='OpenSource-Event-Name'>
                {type === 'PullRequestEvent' ? 'PR' : type.replace('Event', '')}
              </div>
              {type === 'PushEvent' && (
                <>
                  <div className="OpenSource-Right">Message</div>
                  {payload?.commits?.map(({ message }, index) => (
                    <div key={index} className="OpenSource-Right-Font-Size">
                      {message};
                    </div>
                  ))}
                </>
              )}
            </>
          }
        />
      ))}
    </div>
  )
}

export default OpenSourceCmp
