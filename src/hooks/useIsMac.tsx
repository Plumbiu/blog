import { useMemo } from 'react'
import useMounted from './useMounted'

export default function useSystemInfo() {
  const mounted = useMounted()
  const info = useMemo(() => {
    if (!mounted) {
      return null
    }
    const agent = navigator.userAgent.toLowerCase()
    const isWin = agent.includes('win') || agent.includes('wow')
    const isMac = agent.includes('mac os')
    return {
      isWin,
      isMac,
    }
  }, [mounted])

  return info
}
