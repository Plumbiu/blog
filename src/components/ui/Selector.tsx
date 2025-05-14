'use client'

import { type ReactNode, useMemo } from 'react'
import Dropdown, { type DropdownProps } from '../function/Dropdown'

interface SelectorValueItem {
  value: string
  label: ReactNode
}

interface SelectorProps extends Omit<DropdownProps, 'children'> {
  items: SelectorValueItem[]
}

function Selector({ items, label, offset, className }: SelectorProps) {
  const node = useMemo(() => {
    return items.map(({ value, label }) => <div key={value}>{label}</div>)
  }, [items])

  return (
    <Dropdown label={label} offset={offset} className={className}>
      {node}
    </Dropdown>
  )
}

export default Selector
