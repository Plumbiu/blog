import { useMemo } from 'react'
import useMounted from './useMounted'

const MobileRegx =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
// use for lazy loaded components
export default function useIsMobileDeviceWithMemo() {
  const isMobile = useMemo(() => isMobileDevice(), [])
  return isMobile
}

export function isMobileDevice() {
  return MobileRegx.test(navigator.userAgent)
}

export function useIsMobileDeviceWithEffect() {
  const mounted = useMounted()
  return mounted ? isMobileDevice() : null
}
