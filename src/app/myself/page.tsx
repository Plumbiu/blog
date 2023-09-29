import { type ReactNode } from 'react'
import LaptopMacIcon from '@mui/icons-material/LaptopMac'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import RepeatIcon from '@mui/icons-material/Repeat'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import { events } from '@/app/Plumbiu.json'
import MyselfCmp from '@/components/Myself'
import type { Event } from '@plumbiu/github-info'
import InfoCard from '@/components/SideCard'

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
    <>
      <InfoCard />
      <MyselfCmp eventMap={eventMap} events={events as unknown as Event[]} />
    </>
  )
}
