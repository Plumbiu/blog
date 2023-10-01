import { type ReactNode } from 'react'
import {
  LaptopMac,
  AddCircle,
  RemoveRedEye,
  Repeat,
  ErrorOutline,
  LocalDining,
} from '@mui/icons-material'
import events from '@/config/events.json'
import OpenSourceCmp from '@/components/OpenSource'
import type { Event } from '@plumbiu/github-info'

const eventMap: Record<string, ReactNode> = {
  PushEvent: <LaptopMac />,
  PullRequestEvent: <AddCircle />,
  CreateEvent: <RemoveRedEye />,
  WatchEvent: <Repeat />,
  ForkEvent: <LocalDining />,
  IssuesEvent: <ErrorOutline />,
}

export default function Home() {
  return (
    <OpenSourceCmp eventMap={eventMap} events={events as unknown as Event[]} />
  )
}
