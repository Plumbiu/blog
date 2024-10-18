import { useEffect, useLayoutEffect, useState } from 'react'

function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}

export function useLayoutMounted() {
  const [mounted, setMounted] = useState(false)
  useLayoutEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}

export default useMounted
