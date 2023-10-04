import { type ReactNode } from 'react'
import type { Metadata } from 'next'
import {
  LaptopMac,
  AddCircle,
  RemoveRedEye,
  Repeat,
  ErrorOutline,
  LocalDining,
} from '@mui/icons-material'
import events from '~/config/events.json'
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

export const metadata: Metadata = {
  title: 'Plumbiu | 开源之旅',
  description: '这里是 Plumbiu 开源旅程',
}
