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
