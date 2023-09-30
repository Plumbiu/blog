import { type ReactNode } from 'react'
import {
  LaptopMac,
  AddCircle,
  RemoveRedEye,
  Repeat,
  ErrorOutline,
  LocalDining,
} from '@mui/icons-material'
import events from '@/app/Plumbiu.json'
import MyselfCmp from '@/components/Myself'
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
  return <MyselfCmp eventMap={eventMap} events={events as unknown as Event[]} />
}
