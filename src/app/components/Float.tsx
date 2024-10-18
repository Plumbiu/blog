'use client'

import { useTheme } from 'next-themes'
import styles from './Float.module.css'
import { MoonIcon, SunIcon } from '@/components/Icons'
import useMounted from '@/hooks/useMounted'

function Float() {
  const { theme, setTheme } = useTheme()

  const mounted = useMounted()

  return (
    mounted && (
      <div
        className={styles.wrap}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </div>
    )
  )
}

export default Float
