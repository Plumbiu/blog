import { useMemo } from 'react'

const MobileRegx =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
// no reponsive design, just check userAgent
export default function useIsMobileDevice() {
  const isMobile = useMemo(() => isMobileDevice(), [])
  return isMobile
}

export function isMobileDevice() {
  return MobileRegx.test(navigator.userAgent)
}
