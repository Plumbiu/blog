import type { ReactNode } from 'react'
import TimeLine from '@/components/ui/TimeLine'
import { formatTime } from '@/lib/time'
import events from '~/config/events.json'
import './index.css'
import {
  AddCircleIcon,
  ErrorIcon,
  EyeIcon,
  ForkIcon,
  LapTopIcon,
  RepeatIcon,
} from '@/components/icons'

const eventMap: Record<string, ReactNode> = {
  PushEvent: <LapTopIcon />,
  PullRequestEvent: <AddCircleIcon />,
  CreateEvent: <EyeIcon />,
  WatchEvent: <RepeatIcon />,
  ForkEvent: <ForkIcon />,
  IssuesEvent: <ErrorIcon />,
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
      {events.map(({ id, created_at, actor, repo, type, payload }) => (
        <TimeLine
          key={id}
          bgcolor={bgcolorMap[type]}
          left={
            <>
              {formatTime(created_at)}
              <div className="OpenSource-Left">
                {actor.name} {'>'} {repo} {'>'}{' '}
                {payload.ref?.slice(payload.ref.lastIndexOf('/') + 1) ?? 'main'}
              </div>
            </>
          }
          center={eventMap[type]}
          right={
            <>
              <div className="OpenSource-Event-Name">
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
