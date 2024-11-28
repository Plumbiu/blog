'use client'

import { ReactNode, useEffect, useId, useRef, useState } from 'react'
import styles from './Selector.module.css'

interface SelectorValueItem {
  value: string
  label: ReactNode
}

interface SelectorProps {
  items: SelectorValueItem[]
  title: ReactNode
  onChange: (value: string) => void
}

function Selector({ items, title, onChange }: SelectorProps) {
  const ref = useRef(null)
  const [showPanel, setShowPanel] = useState(false)
  const id = useId()

  useEffect(() => {
    window.addEventListener('click', (e) => {
      const target = e.target as Element
      if (!target?.contains) {
        return
      }
      if (target.getAttribute('data-id') !== id) {
        setShowPanel(false)
      }
    })
  }, [])
  return (
    <div data-id={id} ref={ref} className={styles.wrap}>
      <div
        data-id={id}
        className={styles.title}
        onClick={(e) => {
          e.stopPropagation()
          setShowPanel(true)
        }}
      >
        {title}
      </div>
      {showPanel && (
        <div className={styles.panel}>
          {items.map(({ value, label }) => (
            <div
              className={styles.panelItem}
              key={value}
              onClick={() => onChange(value)}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Selector
