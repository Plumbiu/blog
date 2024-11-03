import { LogInfo } from '@/hooks/useConsole'
import { padStartZero } from '@/utils'
import styles from './Console.module.css'

function formatTime(date: number) {
  const d = new Date(date)
  const hh = padStartZero(d.getHours())
  const mm = padStartZero(d.getMinutes())
  const ss = padStartZero(d.getSeconds())
  return `${hh}:${mm}:${ss}`
}

interface ConsoleProps {
  logs: LogInfo[]
}

const Console = ({ logs }: ConsoleProps) => {
  return (
    <div className={styles.console}>
      {logs.map((info) => (
        <div key={info.date.valueOf()}>
          <span>{info.value}</span>
          <span className={styles.console_date}>{formatTime(info.date)}</span>
        </div>
      ))}
    </div>
  )
}

export default Console
