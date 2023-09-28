export function formatTime(time: string | Date | number) {
  const date = new Date(time)
  const y = date.getFullYear()
  const m = padStart(date.getMonth() + 1)
  const d = padStart(date.getDate())
  const hh = padStart(date.getHours())
  const mm = padStart(date.getMinutes())
  const ss = padStart(date.getSeconds())
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

function padStart(s: number | string) {
  return String(s).padStart(2, '0')
}

function howLong(time1: number, time2: number) {
  const cha = time1 - time2
  const day = Math.ceil(cha / (24 * 3600 * 1000))
  const hours = Math.ceil((cha % (24 * 3600 * 1000)) / (3600 * 1000))
  const minutes = Math.ceil(
    ((cha % (24 * 3600 * 1000)) % (3600 * 1000)) / (60 * 1000),
  )
  const seconds = Math.ceil(
    (((cha % (24 * 3600 * 1000)) % (3600 * 1000)) % (60 * 1000)) / 1000,
  )
  return {
    day,
    hours,
    minutes,
    seconds,
  }
}

export function getDuration() {
  const created = new Date('2023-9-26 00:00:00')
  const now = Date.now()
  const { day, hours, minutes, seconds } = howLong(now, created.getTime())
  return `${day} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`
}
