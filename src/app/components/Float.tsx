'use client'

import styles from './Float.module.css'
import { MoonIcon, SunIcon } from '@/app/components/Icons'
import useMounted from '@/hooks/useMounted'
import { getLocalTheme, toggleDataTheme, Dark } from '@/utils/client/theme'
import { useLayoutEffect, useState } from 'react'

function Float() {
  const [themeState, setThemeState] = useState<string>()
  useLayoutEffect(() => {
    const theme = getLocalTheme()
    setThemeState(theme)
  }, [])
  const mounted = useMounted()

  return (
    mounted && (
      <div className={styles.wrap} onClick={toggleDataTheme}>
        {themeState === Dark ? <SunIcon /> : <MoonIcon />}
      </div>
    )
  )
}

export default Float
