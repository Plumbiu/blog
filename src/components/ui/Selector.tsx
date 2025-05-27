'use client'

import { type ReactNode, useMemo } from 'react'
import Tooltip, { type TooltipProps } from '../function/Tooltip'

interface SelectorValueItem {
  value: string
  label: ReactNode
}

interface SelectorProps extends Omit<TooltipProps, 'children'> {
  items: SelectorValueItem[]
}

function Selector({ items, label, offset, className }: SelectorProps) {
  const node = useMemo(() => {
    return items.map(({ value, label }) => <div key={value}>{label}</div>)
  }, [items])

  return (
    <Tooltip label={label} offset={offset} className={className}>
      {node}
    </Tooltip>
  )
}

export default Selector
