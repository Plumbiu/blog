'use client'

import React, { useEffect, useState } from 'react'
import MenuList from './List'
import './index.css'
import { MenuIcon } from '@/components/icons'

const HeaderMenu = () => {
  const [open, setOpen] = useState(false)

  function clickListener(e: any) {
    const target = e.target
    if (
      target?.id?.startsWith('Header-Anchor-') ||
      target?.parentNode?.id?.startsWith('Header-Anchor-')
    ) {
      setOpen(() => !open)
    } else {
      setOpen(() => false)
    }
  }

  useEffect(() => {
    window.addEventListener('click', clickListener)

    return () => {
      window.removeEventListener('click', clickListener)
    }
  }, [open])

  return (
    <div id="Header-Anchor-Menu">
      <MenuIcon className="Hover" id="Header-Anchor-Icon" />
      <div>
        <div
          className="Hader-Menu-List"
          style={{
            transform: `scale(${open ? 1 : 0})`,
          }}
        >
          <MenuList />
        </div>
      </div>
    </div>
  )
}

export default HeaderMenu
